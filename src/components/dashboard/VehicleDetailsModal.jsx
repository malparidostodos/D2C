import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Car, Calendar, Edit2, Trash2, Plus, Check, AlertCircle, ChevronDown, Save } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import AnimatedButton from '../ui/AnimatedButton'
import { validatePlate, formatPlate } from '../../utils/vehicle'

const VehicleDetailsModal = ({ isOpen, onClose, vehicle, onUpdate, onDelete, onBook, bookings = [], isDarkMode }) => {
    const { t } = useTranslation()
    const [isEditing, setIsEditing] = useState(false)
    const [formData, setFormData] = useState({
        plate: '',
        brand: '',
        model: '',
        nickname: ''
    })
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        if (vehicle) {
            setFormData({
                plate: vehicle.plate || '',
                brand: vehicle.brand || '',
                model: vehicle.model || '',
                nickname: vehicle.nickname || ''
            })
            setErrors({})
            setIsEditing(false)
        }
    }, [vehicle, isOpen])

    if (!isOpen || !vehicle) return null

    const getVehicleImage = (type) => {
        switch (type) {
            case 'car': return '/images/vehiculos/sedan.png'
            case 'suv': return '/images/vehiculos/suv.png'
            case 'motorcycle': return '/images/vehiculos/bike.png'
            default: return '/images/vehiculos/sedan.png'
        }
    }

    const handleInputChange = (e) => {
        let { name, value } = e.target

        if (name === 'plate') {
            value = formatPlate(value)
            const isValid = validatePlate(value, vehicle.vehicle_type)
            setErrors(prev => ({
                ...prev,
                plate: isValid ? null : t('booking.invalid_plate', 'Placa inválida')
            }))
        }

        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSave = async () => {
        // Final validation before save
        if (!formData.plate || !validatePlate(formData.plate, vehicle.vehicle_type)) {
            setErrors(prev => ({ ...prev, plate: t('booking.invalid_plate', 'Placa inválida') }))
            return
        }

        setIsLoading(true)
        const updatedVehicle = { ...vehicle, ...formData }
        const success = await onUpdate(updatedVehicle)
        setIsLoading(false)
        if (success) {
            setIsEditing(false)
            setErrors({})
        }
    }

    const handleCancel = () => {
        setFormData({
            plate: vehicle.plate || '',
            brand: vehicle.brand || '',
            model: vehicle.model || '',
            nickname: vehicle.nickname || ''
        })
        setErrors({})
        setIsEditing(false)
    }

    // Filter bookings for this vehicle
    const vehicleBookings = bookings.filter(b => b.vehicle_plate === vehicle.plate && b.status === 'completed')
    const lastBooking = vehicleBookings.length > 0 ? vehicleBookings[0] : null

    // Calculate next maintenance (mock logic: 6 months after last service)
    const getNextMaintenance = () => {
        if (!lastBooking) return null
        const lastDate = new Date(lastBooking.booking_date)
        const nextDate = new Date(lastDate)
        nextDate.setMonth(nextDate.getMonth() + 6)
        return {
            date: nextDate.toLocaleDateString(),
            service: lastBooking.service?.name || 'Mantenimiento General',
            objective: 'Mantener el brillo y la protección'
        }
    }

    const nextMaintenance = getNextMaintenance()

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDarkMode ? 'bg-[#111] border border-white/10' : 'bg-white'} rounded-[2.5rem] p-6 md:p-8 max-w-4xl w-full overflow-hidden shadow-2xl relative`}
            >
                <button
                    onClick={onClose}
                    className={`absolute top-6 right-6 p-2 rounded-full ${isDarkMode ? 'hover:bg-white/10 text-white/40 hover:text-white' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-900'} transition-colors z-10`}
                >
                    <X size={24} />
                </button>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {/* Left Column: Vehicle Card */}
                    <div className={`relative rounded-[2rem] p-8 ${isDarkMode ? 'bg-white/5 border border-white/10' : 'bg-white shadow-xl shadow-blue-900/5 border border-gray-100'} flex flex-col items-center text-center`}>

                        {/* Delete Button (Only visible when not editing) */}
                        {!isEditing && (
                            <button
                                onClick={() => onDelete(vehicle)}
                                className={`absolute top-6 right-6 p-2 rounded-xl transition-colors ${isDarkMode ? 'text-red-400 hover:bg-red-500/10' : 'text-red-500 hover:bg-red-50'}`}
                                title={t('common.delete')}
                            >
                                <Trash2 size={20} />
                            </button>
                        )}

                        {/* Nickname */}
                        <div className="mb-6 w-full">
                            {isEditing ? (
                                <input
                                    type="text"
                                    name="nickname"
                                    value={formData.nickname}
                                    onChange={handleInputChange}
                                    placeholder={t('dashboard.nickname_placeholder', 'APODO')}
                                    className={`w-full text-center text-xl font-bold uppercase tracking-widest bg-transparent border-b-2 ${isDarkMode ? 'text-white border-white/20 focus:border-blue-500' : 'text-gray-900 border-gray-200 focus:border-blue-500'} focus:outline-none transition-colors pb-1`}
                                />
                            ) : (
                                <h3 className={`text-xl font-bold uppercase tracking-widest ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {vehicle.nickname || t('dashboard.nickname_placeholder', 'APODO')}
                                </h3>
                            )}
                        </div>

                        {/* Image */}
                        <div className="w-full aspect-[4/3] flex items-center justify-center mb-6">
                            <img
                                src={getVehicleImage(vehicle.vehicle_type)}
                                alt={vehicle.vehicle_type}
                                className="w-full h-full object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                            />
                        </div>

                        {/* Plate */}
                        <div className="mb-2 w-full">
                            {isEditing ? (
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="plate"
                                        value={formData.plate}
                                        onChange={handleInputChange}
                                        placeholder={t('dashboard.plate_label', 'PLACA')}
                                        className={`w-full text-center text-4xl font-display font-bold bg-transparent border-b-2 ${errors.plate
                                            ? 'border-red-500 text-red-500'
                                            : (isDarkMode ? 'text-white border-white/20 focus:border-blue-500' : 'text-gray-900 border-gray-200 focus:border-blue-500')
                                            } focus:outline-none transition-colors pb-1`}
                                    />
                                    {errors.plate && (
                                        <p className="text-red-500 text-xs mt-1 absolute w-full text-center">{errors.plate}</p>
                                    )}
                                </div>
                            ) : (
                                <h2 className={`text-4xl font-display font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} tracking-tight`}>
                                    {vehicle.plate}
                                </h2>
                            )}
                        </div>

                        {/* Brand & Model */}
                        <div className="w-full">
                            {isEditing ? (
                                <div className="flex gap-2 justify-center">
                                    <input
                                        type="text"
                                        name="brand"
                                        value={formData.brand}
                                        onChange={handleInputChange}
                                        placeholder={t('dashboard.brand_label', 'Marca')}
                                        className={`w-1/2 text-center text-xl font-medium capitalize bg-transparent border-b-2 ${isDarkMode ? 'text-white/80 border-white/20 focus:border-blue-500' : 'text-gray-600 border-gray-200 focus:border-blue-500'} focus:outline-none transition-colors pb-1`}
                                    />
                                    <input
                                        type="text"
                                        name="model"
                                        value={formData.model}
                                        onChange={handleInputChange}
                                        placeholder={t('dashboard.model_label', 'Modelo')}
                                        className={`w-1/2 text-center text-xl font-medium capitalize bg-transparent border-b-2 ${isDarkMode ? 'text-white/80 border-white/20 focus:border-blue-500' : 'text-gray-600 border-gray-200 focus:border-blue-500'} focus:outline-none transition-colors pb-1`}
                                    />
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2 w-full">
                                    <span className={`text-2xl font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-600'} capitalize`}>
                                        {vehicle.brand || t('dashboard.brand_label', 'Marca')}
                                    </span>
                                    <span className={`text-2xl font-medium ${isDarkMode ? 'text-white/80' : 'text-gray-600'} capitalize`}>
                                        {vehicle.model || t('dashboard.model_label', 'Modelo')}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Column: History & Actions */}
                    <div className="flex flex-col justify-between py-4">
                        <div className="space-y-10">
                            {/* Last Service */}
                            <div>
                                <h3 className={`text-2xl font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('dashboard.last_service_title', 'Último Servicio Realizado')}
                                </h3>
                                {lastBooking ? (
                                    <div>
                                        <p className={`text-lg ${isDarkMode ? 'text-white/80' : 'text-gray-600'} mb-2`}>
                                            {lastBooking.service?.name} ({new Date(lastBooking.booking_date).toLocaleDateString()})
                                        </p>
                                        <button className={`flex items-center gap-1 text-sm font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'} hover:underline`}>
                                            {t('dashboard.view_full_history', 'Ver historial completo')}
                                            <ChevronDown size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-400'} italic`}>
                                        {t('dashboard.no_service_history', 'No hay servicios registrados')}
                                    </p>
                                )}
                            </div>

                            {/* Next Maintenance */}
                            <div>
                                <h3 className={`text-lg font-bold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                    {t('dashboard.next_maintenance_title', 'Próximo mantenimiento sugerido:')}
                                </h3>
                                {nextMaintenance ? (
                                    <div>
                                        <p className={`text-base ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                                            {nextMaintenance.service} ({nextMaintenance.date})
                                        </p>
                                        <p className={`text-sm ${isDarkMode ? 'text-white/40' : 'text-gray-400'} mt-1`}>
                                            {t('dashboard.maintenance_objective', 'Objetivo')}: {nextMaintenance.objective}
                                        </p>
                                    </div>
                                ) : (
                                    <p className={`${isDarkMode ? 'text-white/40' : 'text-gray-400'} italic`}>
                                        {t('dashboard.no_maintenance_scheduled', 'Programar primer servicio para ver sugerencias')}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 mt-8 md:mt-0">
                            {isEditing ? (
                                <>
                                    <button
                                        onClick={handleCancel}
                                        disabled={isLoading}
                                        className={`flex-1 py-4 rounded-2xl font-bold text-center transition-colors ${isDarkMode
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        {t('common.cancel', 'Cancelar')}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading || !!errors.plate || !formData.plate}
                                        className="flex-1 py-4 rounded-2xl font-bold text-center bg-green-600 text-white hover:bg-green-700 transition-colors shadow-lg shadow-green-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></span>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                {t('dashboard.save_changes', 'Guardar Cambios')}
                                            </>
                                        )}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className={`flex-1 py-4 rounded-2xl font-bold text-center transition-colors ${isDarkMode
                                            ? 'bg-white/10 text-white hover:bg-white/20'
                                            : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                                            }`}
                                    >
                                        {t('dashboard.edit_vehicle_button', 'Editar Vehículo')}
                                    </button>
                                    <button
                                        onClick={() => onBook(vehicle)}
                                        className="flex-1 py-4 rounded-2xl font-bold text-center bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
                                    >
                                        {t('dashboard.book_new_service', 'Reservar nuevo servicio')}
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    )
}

export default VehicleDetailsModal
