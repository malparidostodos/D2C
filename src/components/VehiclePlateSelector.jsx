import React, { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { Car, Truck, Bike, Plus } from 'lucide-react'

const VehiclePlateSelector = ({ formData, setFormData, touched, handleBlur, validatePlate, formatPlate, handleClientInfoChange }) => {
    const [userVehicles, setUserVehicles] = useState([])
    const [showManualInput, setShowManualInput] = useState(false)
    const [isAuthenticated, setIsAuthenticated] = useState(false)

    useEffect(() => {
        loadUserVehicles()
    }, [])

    const loadUserVehicles = async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
            setIsAuthenticated(true)
            const { data } = await supabase
                .from('user_vehicles')
                .select('*')
                .order('is_primary', { ascending: false })

            setUserVehicles(data || [])

            // Si tiene vehículos y no ha seleccionado uno, preseleccionar el primero
            if (data && data.length > 0 && !formData.clientInfo.plate) {
                handleVehicleSelect(data[0])
            }
        } else {
            setShowManualInput(true)
        }
    }

    const handleVehicleSelect = (vehicle) => {
        setFormData(prev => ({
            ...prev,
            clientInfo: {
                ...prev.clientInfo,
                plate: vehicle.plate
            }
        }))
        setShowManualInput(false)
    }

    const getVehicleIcon = (type) => {
        switch (type) {
            case 'car': return Car
            case 'suv': return Truck
            case 'motorcycle': return Bike
            default: return Car
        }
    }

    if (!isAuthenticated || showManualInput) {
        return (
            <div>
                <div className="flex justify-between items-center mb-2">
                    <label className="block text-white/60 text-sm">
                        Placa del Vehículo
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
                            Usar vehículo guardado
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
                    <p className="text-red-500 text-xs mt-1">Formato de placa inválido para este vehículo</p>
                )}
            </div>
        )
    }

    if (userVehicles.length === 0) {
        return (
            <div>
                <label className="block text-white/60 text-sm mb-2">
                    Placa del Vehículo
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
                <p className="text-white/40 text-xs mt-2">💡 Agrega tus vehículos en el dashboard para seleccionarlos rápidamente</p>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-3">
                <label className="block text-white/60 text-sm">Selecciona tu Vehículo</label>
                <button
                    type="button"
                    onClick={() => setShowManualInput(true)}
                    className="text-xs text-white/60 hover:text-white transition-colors flex items-center gap-1"
                >
                    <Plus size={12} />
                    Otro vehículo
                </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {userVehicles.map((vehicle) => {
                    const Icon = getVehicleIcon(vehicle.vehicle_type)
                    const isSelected = formData.clientInfo.plate === vehicle.plate
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
                    )
                })}
            </div>
        </div>
    )
}

export default VehiclePlateSelector
