import React, { useState, useEffect } from 'react';
import { Car, Truck, Bike, Plus, Check, AlertCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useTranslation } from 'react-i18next';

const VehiclePlateSelector = ({ formData, setFormData, touched, handleBlur, validatePlate, formatPlate, handleClientInfoChange }) => {
    const { t } = useTranslation();
    const [userVehicles, setUserVehicles] = useState([]);
    const [showManualInput, setShowManualInput] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadUserVehicles();
    }, []);

    const loadUserVehicles = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
            setIsAuthenticated(true);
            const { data } = await supabase
                .from('vehicles')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            setUserVehicles(data || []);

            // If user has vehicles and hasn't selected one, preselect the first one if it matches the type
            if (data && data.length > 0 && !formData.clientInfo.plate) {
                // Optional: logic to auto-select if needed
            }
        } else {
            setShowManualInput(true);
        }
    };

    const handleVehicleSelect = (vehicle) => {
        setFormData(prev => ({
            ...prev,
            clientInfo: {
                ...prev.clientInfo,
                plate: vehicle.plate
            }
        }));
        setShowManualInput(false);
    };

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'car': return Car;
            case 'suv': return Truck;
            case 'motorcycle': return Bike;
            default: return Car;
        }
    };

    if (!isAuthenticated || showManualInput) {
        return (
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-white/60 text-sm">
                        {t('vehicle_plate_selector.label')}
                        <span className="text-xs ml-2 text-white/40">
                            ({formData.vehicleType?.id === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                        </span>
                    </label>
                    {isAuthenticated && userVehicles.length > 0 && (
                        <button
                            type="button"
                            onClick={() => setShowManualInput(false)}
                            className="text-xs text-blue-500 hover:text-blue-400"
                        >
                            {t('vehicle_plate_selector.use_saved')}
                        </button>
                    )}
                </div>
                <input
                    type="text"
                    name="plate"
                    value={formData.clientInfo.plate}
                    onChange={handleClientInfoChange}
                    onBlur={() => handleBlur('plate')}
                    className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors uppercase ${touched.plate && formData.clientInfo.plate && !validatePlate(formData.clientInfo.plate, formData.vehicleType?.id)
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-white/50'
                        }`}
                    placeholder={formData.vehicleType?.id === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                />
                {touched.plate && formData.clientInfo.plate && !validatePlate(formData.clientInfo.plate, formData.vehicleType?.id) && (
                    <p className="text-red-500 text-xs mt-1">{t('vehicle_plate_selector.invalid_format')}</p>
                )}
            </div>
        );
    }

    if (userVehicles.length === 0) {
        return (
            <div>
                <label className="block text-white/60 text-sm mb-2">
                    {t('vehicle_plate_selector.label')}
                    <span className="text-xs ml-2 text-white/40">
                        ({formData.vehicleType?.id === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                    </span>
                </label>
                <input
                    type="text"
                    name="plate"
                    value={formData.clientInfo.plate}
                    onChange={handleClientInfoChange}
                    onBlur={() => handleBlur('plate')}
                    className={`w-full bg-white/5 border rounded-xl p-4 text-white focus:outline-none transition-colors uppercase ${touched.plate && formData.clientInfo.plate && !validatePlate(formData.clientInfo.plate, formData.vehicleType?.id)
                        ? 'border-red-500 focus:border-red-500'
                        : 'border-white/10 focus:border-white/50'
                        }`}
                    placeholder={formData.vehicleType?.id === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                />
                <p className="text-white/40 text-xs mt-2">{t('vehicle_plate_selector.add_hint')}</p>
            </div>
        );
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="block text-white/60 text-sm">{t('vehicle_plate_selector.select_vehicle')}</label>
                <button
                    type="button"
                    onClick={() => setShowManualInput(true)}
                    className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                    <Plus size={12} />
                    {t('vehicle_plate_selector.other_vehicle')}
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userVehicles.map((vehicle) => {
                    const Icon = getVehicleIcon(vehicle.type); // Changed from vehicle_type to type based on typical schema, verify if needed
                    const isSelected = formData.clientInfo.plate === vehicle.plate;
                    return (
                        <button
                            key={vehicle.id}
                            type="button"
                            onClick={() => handleVehicleSelect(vehicle)}
                            className={`p-4 rounded-xl border-2 transition-all text-left ${isSelected
                                ? 'bg-white/10 border-white shadow-lg'
                                : 'bg-white/5 border-white/10 hover:border-white/30'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-full ${isSelected ? 'bg-white/20' : 'bg-white/10'}`}>
                                    <Icon size={20} className="text-white" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-white font-bold">{vehicle.plate}</p>
                                    {vehicle.nickname && (
                                        <p className="text-white/60 text-xs">{vehicle.nickname}</p>
                                    )}
                                    {(vehicle.brand || vehicle.model) && (
                                        <p className="text-white/40 text-xs">
                                            {vehicle.brand} {vehicle.model}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default VehiclePlateSelector;
