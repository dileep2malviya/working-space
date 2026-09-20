import AdminSidebar from "@/components/layout/AdminSidebar";
import { getSessionUser } from "@/features/auth/authSelectors";

const AdminLayout = ({ children }) => {
    const sessionUser = getSessionUser();
    const userName = sessionUser?.username || sessionUser?.name || "User";
    const roleLabel = sessionUser?.role || "Admin";
    const profileImage = sessionUser?.avatar;
    const initials = userName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <>
            <AdminSidebar />
            <div className="min-h-screen bg-slate-100 text-slate-900">
                <div className="lg:pl-64">
                    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-600">
                                Operations
                            </p>
                            <h1 className="text-xl font-bold text-slate-950">
                                {userName}
                            </h1>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="hidden text-right sm:block">
                                <p className="text-sm font-semibold text-slate-900">
                                    {userName}
                                </p>
                                <p className="text-xs capitalize text-slate-500">
                                    {roleLabel}
                                </p>
                            </div>

                            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                {profileImage ? (
                                    <img
                                        src={profileImage}
                                        alt={`${userName} profile`}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    initials
                                )}
                            </div>
                        </div>
                    </header>

                    <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
                        {children}
                    </main>
                </div>
            </div>
        </>
    );
};

export default AdminLayout;