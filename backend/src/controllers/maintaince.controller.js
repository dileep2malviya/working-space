import { Maintenance } from '../models/maintenance.model.js';
import { Space } from '../models/space.modal.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError, preparedErrorObject } from '../utils/errorApi.js';
import { isPastBookingTime } from '../utils/helpers.js';
import { apiResponse } from '../utils/responseApi.js';
import { createMaintenanceSchema } from '../validation/maintenance.validation.js';

const createMaintenance = asyncHandler(async (req, res) => {
	const validationResult = createMaintenanceSchema.safeParse(req.body);

	if (!validationResult.success) {
		throw new ApiError(
			400,
			'Validation error',
			preparedErrorObject(validationResult.error.issues)
		);
	}

	const { space, maintenanceDate, startTime, endTime,note } = validationResult.data;

	if (isPastBookingTime(maintenanceDate, startTime)) {
		throw new ApiError(
			400,
			"Booking time must be in the future."
		);
	}

	const selectedDate = new Date(`${maintenanceDate}T00:00:00.000Z`);

	const workspace = await Space.findOne({
		_id: space,
		isDeleted: false,
	}).lean();

	if (!workspace) {
		throw new ApiError(404, 'Workspace not found.');
	}

	const overlappingMaintenance = await Maintenance.findOne({
		space,
		maintenanceDate: selectedDate,
		status: 'ACTIVE',
		startTime: { $lt: endTime },
		endTime: { $gt: startTime },
	}).lean();

	if (overlappingMaintenance) {
		throw new ApiError(
			409,
			'The workspace already has maintenance during the selected time.'
		);
	}

	const maintenance = await Maintenance.create({
		space,
		maintenanceDate: selectedDate,
		startTime,
		endTime,
		status: 'ACTIVE',
		note
	});

	return res.status(201).json(
		apiResponse(201, maintenance, 'Maintenance created successfully.')
	);
});



const getAllMaintenance = asyncHandler(async (req, res) => {
	const { page = 1, limit = 10, status, space } = req.query;

	const filter = {};

	if (status) {
		filter.status = status;
	}

	if (space) {
		filter.space = space;
	}

	const pageNumber = Math.max(Number(page), 1);
	const limitNumber = Math.max(Number(limit), 1);

	const [maintenance, total] = await Promise.all([
		Maintenance.find(filter)
			.populate('space', 'name type capacity isActive')
			.sort({ maintenanceDate: -1, startTime: -1 })
			.skip((pageNumber - 1) * limitNumber)
			.limit(limitNumber)
			.lean(),
		Maintenance.countDocuments(filter),
	]);

	return res.status(200).json(
		apiResponse(
			200,
			{
				maintenance,
				pagination: {
					total,
					page: pageNumber,
					limit: limitNumber,
					totalPages: Math.ceil(total / limitNumber),
				},
			},
			'Maintenance records retrieved successfully.'
		)
	);
});

export { createMaintenance, getAllMaintenance };
