import mongoose from 'mongoose';
import { checkRateLimit } from '../config/redisConnection.js';
import { Booking } from '../models/booking.modal.js';
import { Maintenance } from '../models/maintenance.model.js';
import { Space } from '../models/space.modal.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, preparedErrorObject } from '../utils/errorApi.js';
import { apiResponse } from '../utils/responseApi.js';
import { createBookingSchema, updateBookingSchema } from '../validation/booking.validation.js';
import { convertDate, isPastBookingTime } from '../utils/helpers.js';
import { publishMessageToQueue } from '../config/rabbitmq.js';
import { EMAIL_QUEUE } from '../constants/queue.js';

const createBooking = asyncHandler(async (req, res) => {

    const validationResult = createBookingSchema.safeParse(req.body ?? {});

    if (!validationResult.success) {
        throw new ApiError(
            400,
            "Validation error",
            preparedErrorObject(validationResult.error.issues)
        );
    }

    const {
        space,
        bookingDate,
        startTime,
        endTime,
        notes,
    } = validationResult.data;

    if (isPastBookingTime(bookingDate, startTime)) {
        throw new ApiError(400, "Booking time must be in the future.");
    }

    const workspace = await Space.findOne({
        _id: space,
        isDeleted: false,
    }).lean();

    if (!workspace) {
        throw new ApiError(404, "Workspace not found.")
    }

    console.log("workspaceworkspace", workspace)

    if (!workspace.isActive) {
        throw new ApiError(
            400,
            "This workspace is currently unavailable for booking."
        );
    }

    const selectedDate = new Date(`${bookingDate}T00:00:00.000Z`);

    const maintenanceWindow = await Maintenance.findOne({
        space,
        maintenanceDate: selectedDate,
        status: "ACTIVE",
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    }).lean();

    if (maintenanceWindow) {
        throw new ApiError(
            409,
            "The workspace is under maintenance during the selected time."
        );
    }

    const existingBooking = await Booking.findOne({
        space,
        bookingDate: selectedDate,
        status: "APPROVED",
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    }).lean();

    if (existingBooking) {
        throw new ApiError(
            409,
            "The selected time slot is already booked."
        );
    }

    const booking = await Booking.create({
        user: req.user._id,
        space,
        bookingDate: selectedDate,
        startTime,
        endTime,
        notes,
        status: "PENDING",
    });

    if(!booking){
        throw new ApiError(400, "Something went wrong.");
    }

    const getbookingdate = convertDate(selectedDate)

    const bookingMessage = {
        space: workspace.name,
        user: req.user.email,
        selectedDate : getbookingdate,
        startTime,
        endTime,
        notes,
        status: "PENDING",
    }

    const message = {
        type: 'CREATE_BOOKING',
        payload: {
            to: req.user.email,
            subject: "Your booking created successfully",
            text: `Your booking created successfully.`,
            data: bookingMessage
        }
    };

    // await publishMessageToQueue(EMAIL_QUEUE, message);

    return res.status(201).json(
        apiResponse(
            201,
            booking,
            "Booking created successfully."
        )
    );
});

const getBooking = asyncHandler(async (req, res) => {
    const bookingFilter = req.user.role === "admin"
        ? {}
        : { user: req.user._id };

    const bookings = await Booking.find(bookingFilter)
        .populate("user", "email firstName lastName")
        .populate("space", "name type capacity")
        .sort({ bookingDate: 1 })
        .lean();

    return res.status(200).json(
        apiResponse(200, bookings, "Bookings retrieved successfully.")
    );
});

const updateBooking = asyncHandler(async (req, res) => {

    const validationResult = updateBookingSchema.safeParse(req.body);

    if (!validationResult.success) {
        throw new ApiError(
            400,
            "Validation error",
            preparedErrorObject(validationResult.error.issues)
        );
    }

    const updateData = validationResult.data;

    const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id,
    }).lean();

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    const bookingDate = updateData.bookingDate
        ? new Date(`${updateData.bookingDate}T00:00:00.000Z`)
        : booking.bookingDate;

    const startTime = updateData.startTime ?? booking.startTime;

    if (isPastBookingTime(bookingDate, startTime)) {
        throw new ApiError(
            400,
            "Booking time must be in the future."
        );
    }

    if (booking.status !== "PENDING") {
        throw new ApiError(400, "Only pending bookings can be updated.");
    }

    const space = updateData.space ?? booking.space;
    const endTime = updateData.endTime ?? booking.endTime;

    const workspace = await Space.findOne({ _id: space, isDeleted: false }).lean();
    if (!workspace) {
        throw new ApiError(404, "Workspace not found.");
    }
    if (!workspace.isActive) {
        throw new ApiError(400, "This workspace is currently unavailable for booking.");
    }

    const maintenanceWindow = await Maintenance.findOne({
        space,
        maintenanceDate: bookingDate,
        status: "ACTIVE",
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    }).lean();

    if (maintenanceWindow) {
        throw new ApiError(409, "The workspace is under maintenance during the selected time.");
    }

    const existingBooking = await Booking.findOne({
        _id: { $ne: booking._id },
        space,
        bookingDate,
        status: "APPROVED",
        startTime: { $lt: endTime },
        endTime: { $gt: startTime },
    }).lean();

    if (existingBooking) {
        throw new ApiError(409, "The selected time slot is already booked.");
    }

    const updatedBooking = await Booking.findOneAndUpdate(
        { _id: booking._id, user: req.user._id, status: "PENDING" },
        { $set: { ...updateData, bookingDate, startTime, endTime } },
        { new: true, runValidators: true }
    );

    if (!updatedBooking) {
        throw new ApiError(400, "Only pending bookings can be updated.");
    }

    return res.status(200).json(apiResponse(200, null, "Booking updated successfully."));
});

const cancelBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findOne({
        _id: req.params.id,
        user: req.user._id,
    });

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (!["PENDING", "APPROVED"].includes(booking.status)) {
        throw new ApiError(400, "Only pending or approved bookings can be cancelled.");
    }

    const bookingStart = new Date(booking.bookingDate);
    const [startHour, startMinute] = booking.startTime.split(":").map(Number);
    bookingStart.setUTCHours(startHour, startMinute, 0, 0);

    if (bookingStart <= new Date()) {
        throw new ApiError(400, "Only future bookings can be cancelled.");
    }

    const cancelledBooking = await Booking.findOneAndUpdate(
        {
            _id: booking._id,
            user: req.user._id,
            status: { $in: ["PENDING", "APPROVED"] },
            bookingDate: { $gte: booking.bookingDate },
        },
        {
            $set: {
                status: "CANCELLED",
                cancelledAt: new Date(),
                cancelledBy: req.user._id,
            },
        },
        { new: true, runValidators: true }
    );

    if (!cancelledBooking) {
        throw new ApiError(400, "Booking could not be cancelled.");
    }

    return res.status(200).json(apiResponse(200, null, "Booking cancelled successfully."));
});

const approveBooking = asyncHandler(async (req, res) => {

    if (!mongoose.isValidObjectId(req.params.id)) {
        throw new ApiError(400, "Invalid space id.");
    }

    const booking = await Booking.findById(req.params.id).populate("user", "email");

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.status !== "PENDING") {
        throw new ApiError(
            400,
            "Only pending bookings can be approved."
        );
    }

    const findSpace = await Space.findById(booking.space)
        .select("name")
        .lean();

    if (!findSpace) {
        throw new ApiError(400, "Work space not found.");
    }

    const overlappingBookings = await Booking.find({
        _id: { $ne: booking._id },
        space: booking.space,
        bookingDate: booking.bookingDate,
        status: "PENDING",
        startTime: { $lt: booking.endTime },
        endTime: { $gt: booking.startTime },
    }).populate("user", "email").lean();

    booking.status = "APPROVED";
    booking.approvedBy = req.user._id;
    booking.approvedAt = new Date();

    await booking.save();

    if (booking.user?.email) {
        const approvedMessage = {
            bookingDate: convertDate(booking.bookingDate),
            startTime: booking.startTime,
            endTime: booking.endTime,
            space: findSpace.name,
        };

        const message = {
            type: 'APPROVED_BOOKING',
            payload: {
                to: booking.user.email,
                subject: "Your booking approved",
                text: `Your booking approved by Admin.`,
                data: approvedMessage,
            },
        };

        await publishMessageToQueue(EMAIL_QUEUE, message);
    }

    if (overlappingBookings.length > 0) {
        const overlappingIds = overlappingBookings.map((item) => item._id);

        await Booking.updateMany(
            { _id: { $in: overlappingIds } },
            {
                $set: {
                    status: "REJECTED",
                    rejectedBy: req.user._id,
                    rejectedAt: new Date(),
                    rejectionReason:
                        "Another overlapping booking was approved.",
                },
            }
        );

        for (const overlappingBooking of overlappingBookings) {
            if (!overlappingBooking.user || !overlappingBooking.user.email) continue;

            const rejectMessage = {
                bookingDate: convertDate(overlappingBooking.bookingDate),
                startTime: overlappingBooking.startTime,
                endTime: overlappingBooking.endTime,
                space: findSpace.name,
            };

            const message = {
                type: 'REJECTED_BOOKING',
                payload: {
                    to: overlappingBooking.user.email,
                    subject: "Your booking rejected",
                    text: `Your booking rejected by Admin due to time conflict.`,
                    data: rejectMessage,
                },
            };

            await publishMessageToQueue(EMAIL_QUEUE, message);
        }
    }

    return res.status(200).json(
        apiResponse(
            200,
            null,
            "Booking approved successfully."
        )
    );
});

const rejectBooking = asyncHandler(async (req, res) => {
    const booking = await Booking.findById(req.params.id).populate("user", "email");

    if (!booking) {
        throw new ApiError(404, "Booking not found.");
    }

    if (booking.status !== "PENDING") {
        throw new ApiError(
            400,
            "Only pending bookings can be rejected."
        );
    }

    booking.status = "REJECTED";
    booking.rejectedBy = req.user._id;
    booking.rejectedAt = new Date();

    const rejectBooking = await booking.save();

    if(!rejectBooking){
        throw new ApiError(400, "Something went wrong.");
    }

    const findSpace = await Space.findById(rejectBooking.space)
  .select("name")
  .lean();

    if(!findSpace){
        throw new ApiError(400, "Work space not found.");
    }

    const rejectMessage = {
        bookingDate: convertDate(rejectBooking.bookingDate),
        startTime: rejectBooking.startTime,
        endTime: rejectBooking.endTime,
        space: findSpace.name,
    };

    const recipientEmail = booking.user?.email || req.user.email;

    const message = {
        type: 'REJECTED_BOOKING',
        payload: {
            to: recipientEmail,
            subject: "Your booking rejected",
            text: `Your booking rejected by Admin.`,
            data: rejectMessage,
        }
    };

    await publishMessageToQueue(EMAIL_QUEUE, message);

    return res.status(200).json(
        apiResponse(
            200,
            null,
            "Booking rejected successfully."
        )
    );
});

export {
    createBooking,
    getBooking,
    updateBooking,
    cancelBooking,
    approveBooking,
    rejectBooking
};