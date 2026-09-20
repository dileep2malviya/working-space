import React from 'react'
import { useNavigate } from "react-router-dom";
import { CalendarDays, LayoutDashboard, LogOut, Settings, Warehouse } from "lucide-react";
import { NavLink } from "react-router-dom";
import { getSessionUser, getUserRole } from "@/features/auth/authSelectors";

const AdminSidebar = () => {
    const navigate = useNavigate();
    const sessionUser = getSessionUser();
    const role = getUserRole()?.toLowerCase();
    const userName = sessionUser?.username || sessionUser?.name || "User";
    const roleLabel = sessionUser?.role || role || "Member";
    const navigation = role === "admin"
        ? [
            { label: "Spaces", to: "/admin/spaces", icon: Warehouse },
            { label: "Bookings", to: "/admin/bookings", icon: CalendarDays },
            { label: "Maintenance", to: "/admin/maintenance", icon: Settings },
        ]
        : role === "member"
            ? [{ label: "Bookings", to: "/member/bookings", icon: CalendarDays },
            ]
            : [];

    const signOut = () => {
        sessionStorage.removeItem("user");
        sessionStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
    };

    return (
        <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col bg-slate-950 px-5 py-6 text-white lg:flex">
            <div className="mb-10 flex items-center gap-3 px-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500 font-black">
                    S
                </div>

                <div>
                    <p className="text-lg font-bold tracking-tight">{userName}</p>
                    <p className="text-xs capitalize text-slate-400">{roleLabel}</p>
                </div>
            </div>

            <nav className="flex flex-1 flex-col gap-2">
                <p className="mb-2 px-3 text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Workspace
                </p>

                {navigation.map(({ label, to, icon: Icon, end }) => (
                    <NavLink
                        key={to}
                        to={to}
                        end={end}
                        className={({ isActive }) =>
                            `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${isActive
                                ? "bg-blue-500 text-white shadow-lg shadow-blue-950/30"
                                : "text-slate-400 hover:bg-slate-900 hover:text-white"
                            }`
                        }
                    >
                        <Icon size={18} />
                        {label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-slate-800 pt-5">
                <button
                    type="button"
                    onClick={signOut}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                    <LogOut size={18} />
                    Sign out
                </button>
            </div>
        </aside>
    )
}

export default AdminSidebar