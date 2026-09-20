import { Space } from '../models/space.modal.js';
import { Booking } from '../models/booking.modal.js';
import { ApiError, preparedErrorObject } from '../utils/errorApi.js';
import { apiResponse } from '../utils/responseApi.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createSpaceSchema, updateSpaceSchema } from '../validation/space.validation.js';
import mongoose from 'mongoose';

const normalizeAmenities = (amenities) => {
    if (Array.isArray(amenities)) {
        return amenities;
    }

    if (typeof amenities !== 'string') {
        return amenities;
    }

    const value = amenities.trim();
    if (!value) {
        return [];
    }

    try {
        const parsedAmenities = JSON.parse(value);
        return Array.isArray(parsedAmenities) ? parsedAmenities : [parsedAmenities];
    } catch {
        return [value];
    }
};

const getAllSpace = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, date } = req.query;

    const pageNumber = Math.max(Number(page), 1);
    const limitNumber = Math.max(Number(limit), 1);

    const filter = { isDeleted: false };

    if (date) {
        const parsedDate = new Date(date);
        if (Number.isNaN(parsedDate.getTime())) {
            throw new ApiError(400, 'Invalid date.');
        }

        const startOfDay = new Date(parsedDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(parsedDate);
        endOfDay.setHours(23, 59, 59, 999);

        const bookedSpaceIds = await Booking.distinct('space', {
            bookingDate: { $gte: startOfDay, $lte: endOfDay },
            status: { $in: ['PENDING', 'APPROVED'] },
        });

        if (bookedSpaceIds.length) {
            filter._id = { $nin: bookedSpaceIds };
        }
    }

    const [workspaces, total] = await Promise.all([
        Space.find(filter)
            .sort({ name: 1 })
            .skip((pageNumber - 1) * limitNumber)
            .limit(limitNumber)
            .lean(),
        Space.countDocuments(filter),
    ]);

    return res.status(200).json(
        apiResponse(
            200,
            {
                workspaces,
                pagination: {
                    total,
                    page: pageNumber,
                    limit: limitNumber,
                    totalPages: Math.ceil(total / limitNumber),
                },
            },
            'Work spaces retrieved successfully'
        )
    );
});

const createSpace = asyncHandler(async (req, res) => {
    if (req?.body?.amenities) {
        req.body.amenities = normalizeAmenities(req.body.amenities);
    }

    const validationResult = createSpaceSchema.safeParse(req.body ?? {});

    if (!validationResult.success) {
        const errors = preparedErrorObject(validationResult.error.issues);
        throw new ApiError(400, 'Validation error', errors);
    }

    const { name, type, capacity, amenities, description, isActive } = validationResult.data;

    const normalizedName = name.trim().toLowerCase();

    const existingSpace = await Space.findOne({ name: normalizedName, type, isDeleted: false }).lean();

    if (existingSpace) {
        throw new ApiError(
            409,
            "A workspace with this name already exists.",
            {
                name: "This workspace name is already in use. Please choose a different name.",
            }
        )
    }

    const spaceData = {
        name: normalizedName,
        type,
        capacity,
        amenities,
        description,
        isActive,
        createdBy: req.user._id,
    }

    const workspace = await Space.create(spaceData);

    if (!workspace) {
        throw new ApiError(500, "Something went wrong while crearing the work space", {});
    }

    return res.status(201).json(apiResponse(201, workspace, "Work space Created successfully"));
});

const updateSpace = asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ApiError(400, "Invalid space id.");
    }

    if (req.body.amenities) {
        req.body.amenities = normalizeAmenities(req.body.amenities);
    }
    
    const validationResult = updateSpaceSchema.safeParse(req.body ?? {});

    if (!validationResult.success) {
        throw new ApiError(400, 'Validation error', preparedErrorObject(validationResult.error.issues));
    }

    const currentSpace = await Space.findOne({
        _id: req.params.id,
        createdBy: req.user._id,
        isDeleted: false,
    }).lean();

    if (!currentSpace) {
        throw new ApiError(404, 'Workspace not found.');
    }

    const updateData = {
        ...validationResult.data,
        updatedBy: req.user._id,
    };
    if (updateData.name) {
        updateData.name = updateData.name.trim().toLowerCase();
    }

    if (updateData.name || updateData.type) {
        const duplicateSpace = await Space.findOne({
            _id: { $ne: req.params.id },
            name: updateData.name ?? currentSpace.name,
            type: updateData.type ?? currentSpace.type,
            isDeleted: false,
        }).lean();
        if (duplicateSpace) {
            throw new ApiError(409, 'A workspace with this name already exists.');
        }
    }

    const workspace = await Space.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id, isDeleted: false },
        { $set: updateData },
        { new: true, runValidators: true }
    ).lean();

    if (!workspace) {
        throw new ApiError(404, 'Workspace not found.');
    }

    return res.status(200).json(apiResponse(200, workspace, 'Work space updated successfully'));
});

const deleteSpace = asyncHandler(async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ApiError(400, "Invalid space id.");
    }

    const workspace = await Space.findOneAndUpdate(
        { _id: req.params.id, createdBy: req.user._id, isDeleted: false },
        { $set: { isDeleted: true, isActive: false, updatedBy: req.user._id } },
        { new: true }
    ).lean();

    if (!workspace) {
        throw new ApiError(404, 'Workspace not found.');
    }

    return res.status(200).json(apiResponse(200, null, 'Work space deleted successfully'));
});

const getSpaceById = asyncHandler(async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ApiError(400, 'Invalid space id.');
    }

    const space = await Space.findOne({ _id: req.params.id, isActive: true, isDeleted: false }).lean();

    if (!space) {
        throw new ApiError(404, 'Workspace not found.');
    }

    const date = req.query.date || new Date();

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
        throw new ApiError(400, 'Invalid date.');
    }

    const startOfDay = new Date(parsedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setHours(23, 59, 59, 999);

    

    const bookings = await Booking.find({
        space: req.params.id,
        bookingDate: { $gte: startOfDay, $lte: endOfDay },
        status: { $in: ['APPROVED'] },
    })
        .select('startTime endTime status')
        .lean();

    return res.status(200).json(
        apiResponse(200, { space, bookings }, 'Work space retrieved successfully')
    );
});

const getSpaceDropdown = asyncHandler(async (req, res) => {
    const spaces = await Space.find({ isActive: true, isDeleted: false })
        .select('name type capacity')
        .lean();
    const options = spaces.map((space) => ({
        value: String(space._id),
        label: `${space.name} - ${space.type} - ${space.capacity}`,
    }));

    return res.status(200).json(
        apiResponse(200, options, 'Active workspaces retrieved successfully.')
    );
});

export {
    getAllSpace,
    createSpace,
    updateSpace,
    deleteSpace,
    getSpaceDropdown,
    getSpaceById
};