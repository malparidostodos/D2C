export const validatePlate = (plate, typeId) => {
    if (!plate) return false
    const cleanPlate = plate.replace(/-/g, '').toUpperCase()
    if (typeId === 'motorcycle') {
        return /^[A-Z]{3}\d{2}[A-Z]?$/.test(cleanPlate)
    } else {
        return /^[A-Z]{3}\d{3}$/.test(cleanPlate)
    }
}

export const formatPlate = (value) => {
    const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    if (clean.length > 3) {
        return `${clean.slice(0, 3)}-${clean.slice(3, 6)}` + (clean.length > 6 ? clean.slice(6, 7) : '')
    }
    return clean
}
