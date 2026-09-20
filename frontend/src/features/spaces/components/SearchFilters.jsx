import CustomButton from "@/components/ui/button";
import { CustomInput } from "@/components/ui/input/Input";
import { CalendarDays, Building2, Users, Search } from "lucide-react";

export default function SearchFilters() {
    return (
        <div className="filters">

            <div className="filter-card">
                <Building2 />
                <select>
                    <option>Space Type</option>
                    <option>Desk</option>
                    <option>Meeting Room</option>
                    <option>Private Office</option>
                </select>
            </div>

            <div className="filter-card">
                <Users />
                <select>
                    <option>Capacity</option>
                    <option>1-5</option>
                    <option>5-10</option>
                    <option>10+</option>
                </select>
            </div>

            <div className="filter-card">
                <CalendarDays />
                <input type="date" />
            </div>

            <CustomButton
                type="button"
                // onclick={() => navigate("/register")}
                className="btn btn-primary search-btn"
            >
                <Search size={18} />
                Search
            </CustomButton>

        </div>
    );
}