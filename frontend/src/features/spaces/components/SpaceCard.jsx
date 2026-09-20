import { Users, Wifi, Monitor, Coffee, Snowflake } from "lucide-react";
import { Link } from "react-router-dom";

const amenityIcons = {
  wifi: <Wifi size={18} />,
  projector: <Monitor size={18} />,
  coffee: <Coffee size={18} />,
  ac: <Snowflake size={18} />,
};

export default function SpaceCard({ space }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl">

      <img
        src={space.image}
        alt={space.name}
        className="h-56 w-full object-cover"
      />

      <div className="space-y-4 p-6">

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            {space.name}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-gray-600">
            <Users size={18} />
            <span>{space.capacity} Seats</span>
          </div>
        </div>

        <div className="space-y-2">
          {space.amenities.map((item) => (
            <div
              key={item}
              className="flex items-center gap-2 text-gray-600"
            >
              {amenityIcons[item]}
              <span className="capitalize">{item}</span>
            </div>
          ))}
        </div>

        <div>
          {space.available ? (
            <span className="rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
              🟢 Available
            </span>
          ) : (
            <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">
              🔴 Occupied
            </span>
          )}
        </div>

        <Link
          to={`/spaces/${space.id}`}
          className="block rounded-xl bg-blue-600 py-3 text-center font-semibold text-white transition hover:bg-blue-700"
        >
          View Details
        </Link>

      </div>
    </div>
  );
}