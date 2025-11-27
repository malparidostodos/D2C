import { useState } from 'react'
import { supabase } from '../lib/supabase'

const AuthExample = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    // 🔐 LOGIN
    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) {
            setMessage(`❌ Error: ${error.message}`)
        } else {
            setMessage(`✅ Bienvenido! ${data.user.email}`)
        }
        setLoading(false)
    }

    // 📝 SIGN UP
    const handleSignUp = async (e) => {
        e.preventDefault()
        setLoading(true)
        setMessage('')

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            setMessage(`❌ Error: ${error.message}`)
        } else {
            setMessage(`✅ Cuenta creada! Revisa tu email para confirmar.`)
        }
        setLoading(false)
    }

    // 🚪 LOGOUT
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut()
        if (!error) {
            setMessage('👋 Sesión cerrada')
        }
    }

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-6">Autenticación Supabase</h2>

            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="tu@email.com"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Contraseña</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        placeholder="••••••••"
                    />
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>

                    <button
                        onClick={handleSignUp}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                        {loading ? 'Cargando...' : 'Registrarse'}
                    </button>
                </div>

                <button
                    onClick={handleLogout}
                    type="button"
                    className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700"
                >
                    Cerrar Sesión
                </button>
            </form>

            {message && (
                <div className="mt-4 p-3 bg-gray-100 rounded-lg text-sm">
                    {message}
                </div>
            )}
        </div>
    )
}

export default AuthExample
