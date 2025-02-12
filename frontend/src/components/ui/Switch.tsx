import React from 'react';

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
}

export const Switch: React.FC<SwitchProps> = ({
    checked,
    onChange,
    label,
    description
}) => {
    return (
        <div className="flex items-center justify-between">
            <div>
                {label && <h3 className="font-medium">{label}</h3>}
                {description && <p className="text-sm text-gray-500">{description}</p>}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
                <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`
                    w-11 h-6 rounded-full 
                    after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                    after:bg-white after:rounded-full after:h-5 after:w-5 
                    after:transition-all after:duration-300
                    peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                    ${checked ? 
                        'bg-blue-600 after:translate-x-full' : 
                        'bg-gray-200'
                    }
                `}></div>
            </label>
        </div>
    );
};
