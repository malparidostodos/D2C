import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { supabase } from '../../lib/supabase'
import { validatePlate, formatPlate } from '../../utils/vehicle'

const addVehicleSchema = z.object({
    vehicleType: z.string(),
    plate: z.string().min(1, "Plate is required"),
    nickname: z.string().optional(),
    brand: z.string().optional(),
    model: z.string().optional()
}).superRefine((data, ctx) => {
    if (!validatePlate(data.plate, data.vehicleType)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Invalid plate format",
            path: ["plate"]
        })
    }
})

const AddVehicleModal = ({ isOpen, onClose, onSuccess, vehicleToEdit, isDarkMode }) => {
    const { t } = useTranslation()
    const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(addVehicleSchema),
        defaultValues: {
            vehicleType: 'car',
            plate: '',
            nickname: '',
            brand: '',
            model: ''
        }
    })

    const vehicleType = watch('vehicleType')
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            if (vehicleToEdit) {
                setValue('vehicleType', vehicleToEdit.vehicle_type)
                setValue('plate', vehicleToEdit.plate)
                setValue('nickname', vehicleToEdit.nickname || '')
                setValue('brand', vehicleToEdit.brand || '')
                setValue('model', vehicleToEdit.model || '')
            } else {
                reset({
                    vehicleType: 'car',
                    plate: '',
                    nickname: '',
                    brand: '',
                    model: ''
                })
            }
            setError('')
        }
    }, [isOpen, vehicleToEdit, reset, setValue])

    const vehicleTypes = [
        { id: 'car', name: t('dashboard.vehicle_types.car'), image: '/images/vehiculos/sedan.png' },
        { id: 'suv', name: t('dashboard.vehicle_types.suv'), image: '/images/vehiculos/suv.png' },
        { id: 'motorcycle', name: t('dashboard.vehicle_types.motorcycle'), image: '/images/vehiculos/bike.png' },
    ]

    const onSubmit = async (formData) => {
        setError('')
        const { data: { user } } = await supabase.auth.getUser()

        // Check for duplicates if plate changed
        if (!vehicleToEdit || (vehicleToEdit && vehicleToEdit.plate !== formData.plate)) {
            const { data: existingBookings } = await supabase
                .from('bookings')
                .select('client_email')
                .eq('vehicle_plate', formData.plate)
                .limit(1)

            if (existingBookings && existingBookings.length > 0) {
                const bookingEmail = existingBookings[0].client_email
                if (bookingEmail !== user.email) {
                    setError(t('dashboard.add_vehicle_modal.plate_taken_error'))
                    return
                }
            }
        }

        let errorResult = null

        if (vehicleToEdit) {
            const { error: updateError } = await supabase
                .from('user_vehicles')
                .update({
                    plate: formData.plate,
                    vehicle_type: formData.vehicleType,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    nickname: formData.nickname || null
                })
                .eq('id', vehicleToEdit.id)
            errorResult = updateError
        } else {
            const { error: insertError } = await supabase
                .from('user_vehicles')
                .insert([{
                    user_id: user.id,
                    plate: formData.plate,
                    vehicle_type: formData.vehicleType,
                    brand: formData.brand || null,
                    model: formData.model || null,
                    nickname: formData.nickname || null
                }])
            errorResult = insertError
        }

        if (errorResult) {
            if (errorResult.code === '23505') {
                setError(t('dashboard.add_vehicle_modal.plate_exists_error'))
            } else {
                setError(errorResult.message)
            }
        } else {
            onSuccess()
        }
    }

    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={(e) => e.stopPropagation()}
                className={`${isDarkMode ? 'bg-[#111] border-white/10' : 'bg-white border-gray-200'} border rounded-3xl p-6 md:p-8 max-w-md w-full`}
            >
                <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {vehicleToEdit ? t('dashboard.edit_vehicle_title', 'Editar Vehículo') : t('dashboard.add_vehicle_modal.title')}
                    </h2>
                    <button
                        onClick={onClose}
                        className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-white/10' : 'hover:bg-gray-100'}`}
                    >
                        <X size={20} className={isDarkMode ? 'text-white' : 'text-gray-500'} />
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.type_label')}</label>
                        <div className="grid grid-cols-3 gap-2">
                            {vehicleTypes.map((type) => (
                                <button
                                    key={type.id}
                                    type="button"
                                    onClick={() => setValue('vehicleType', type.id)}
                                    className={`p-3 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${vehicleType === type.id
                                        ? (isDarkMode ? 'bg-white text-black border-white' : 'bg-black text-white border-black')
                                        : (isDarkMode ? 'bg-white/5 text-white border-white/10 hover:bg-white/10' : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100')
                                        }`}
                                >
                                    <img src={type.image} alt={type.name} className="w-12 h-8 object-contain" />
                                    <span className="text-xs">{type.name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>
                            {t('dashboard.add_vehicle_modal.plate_label')}
                            <span className="text-xs ml-2">
                                ({vehicleType === 'motorcycle' ? 'AAA-00 o AAA-00A' : 'AAA-000'})
                            </span>
                        </label>
                        <input
                            type="text"
                            {...register('plate')}
                            onChange={(e) => setValue('plate', formatPlate(e.target.value))}
                            className={`w-full border rounded-xl p-3 focus:outline-none transition-colors uppercase 
                                ${isDarkMode ? 'bg-white/5 text-white' : 'bg-gray-50 text-gray-900'}
                                ${errors.plate
                                    ? 'border-red-500 focus:border-red-500'
                                    : (isDarkMode ? 'border-white/10 focus:border-white/50' : 'border-gray-200 focus:border-gray-400')
                                }`}
                            placeholder={vehicleType === 'motorcycle' ? 'ABC-12D' : 'ABC-123'}
                            maxLength={7}
                        />
                        {errors.plate && (
                            <p className="text-red-500 text-xs mt-1">{t('dashboard.add_vehicle_modal.plate_error')}</p>
                        )}
                    </div>

                    <div>
                        <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.nickname_label')}</label>
                        <input
                            type="text"
                            {...register('nickname')}
                            className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                ${isDarkMode
                                    ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                }`}
                            placeholder={t('dashboard.add_vehicle_modal.nickname_placeholder')}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.brand_label')}</label>
                            <input
                                type="text"
                                {...register('brand')}
                                className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                    ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                    }`}
                                placeholder="Toyota"
                            />
                        </div>
                        <div>
                            <label className={`block text-sm mb-2 ${isDarkMode ? 'text-white/60' : 'text-gray-500'}`}>{t('dashboard.add_vehicle_modal.model_label')}</label>
                            <input
                                type="text"
                                {...register('model')}
                                className={`w-full border rounded-xl p-3 focus:outline-none transition-colors 
                                    ${isDarkMode
                                        ? 'bg-white/5 border-white/10 text-white focus:border-white/50'
                                        : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-gray-400'
                                    }`}
                                placeholder="Corolla"
                            />
                        </div>
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed
                            ${isDarkMode
                                ? 'bg-white text-black hover:bg-gray-100'
                                : 'bg-black text-white hover:bg-gray-800'
                            }`}
                    >
                        {isSubmitting
                            ? (vehicleToEdit ? t('dashboard.updating', 'Actualizando...') : t('dashboard.add_vehicle_modal.adding'))
                            : (vehicleToEdit ? t('dashboard.update_vehicle', 'Actualizar Vehículo') : t('dashboard.add_vehicle_modal.add_button'))}
                    </button>
                </form>
            </motion.div>
        </div>
    )
}

export default AddVehicleModal
