import { Controller } from "react-hook-form";
import {
    Autocomplete,
    TextField,
    Chip,
} from "@mui/material";

const CustomMultiSelect = ({
    name,
    control,
    label,
    options = [],
    placeholder = "Select...",
    error,
    disabled = false,
}) => {
    return (
        <div className="relative">
        <Controller
            name={name}
            control={control}
            defaultValue={[]}
            render={({ field }) => (
                <Autocomplete
                    multiple
                    options={options}
                    value={field.value || []}
                    onChange={(_, value) => field.onChange(value)}
                    disabled={disabled}
                    filterSelectedOptions
                    renderTags={(value, getTagProps) =>
                        value.map((option, index) => (
                            <Chip
                                label={option}
                                {...getTagProps({ index })}
                                key={option}
                            />
                        ))
                    }
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={label}
                            placeholder={placeholder}
                            error={!!error}
                            helperText={error}
                        />
                    )}
                />
            )}
        />
        </div>
    );
};

export default CustomMultiSelect;