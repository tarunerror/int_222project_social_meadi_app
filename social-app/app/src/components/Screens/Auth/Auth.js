import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, SignUpUser } from '../../../store/userSlice';
import logo from '../../../highon.png';

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const handleToggle = () => {
        setIsLogin((prevIsLogin) => !prevIsLogin);
    };

    const handleAuth = async (e) => {
        e.preventDefault();

        const username = e.target.username?.value;
        const password = e.target.password?.value;
        const name = e.target.name?.value;
        let image = e.target.image?.files[0];

        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

        try {
            if (username === '' || password === '') {
                return;
            }
            if (!isLogin && (name === '' || image === '')) {
                return;
            }

            if (isLogin) {
                dispatch(loginUser({ username, password }));
            } else {
                const base64Image = await toBase64(image);
                dispatch(SignUpUser({ username, password, name, image: base64Image }));
                setIsLogin(true);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="w-96 border border-gray-300 p-4 rounded-md">
                <div className="flex justify-center mb-4">
                    <img src={logo} alt="logo" className="w-24" />
                </div>
                <form className="flex flex-col" onSubmit={handleAuth}>
                    <h1 className="text-3xl font-bold mb-4 text-center">{isLogin ? 'Login' : 'Sign Up'}</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        className="border border-gray-300 p-2 mb-4 rounded-md"
                        name="username"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="border border-gray-300 p-2 mb-4 rounded-md"
                        name="password"
                    />
                    {!isLogin && (
                        <>
                            <input
                                type="text"
                                placeholder="Name"
                                className="border border-gray-300 p-2 mb-4 rounded-md"
                                name="name"
                            />
                            <input
                                type="file"
                                accept="image/*"
                                placeholder="Image"
                                className="border border-gray-300 p-2 mb-4 rounded-md"
                                name="image"

                            />
                        </>
                    )}
                    <button
                        type="submit"
                        className="bg-blue-500 text-white p-2 rounded-md"
                    >
                        {loading ? 'Loading...' : isLogin ? 'Login' : 'Sign Up'}
                    </button>
                    {error && <p className="text-red-500 mt-2">{error}</p>}
                </form>
                <p className="text-center mt-4">
                    {isLogin ? "Don't have an account?" : 'Already have an account?'}
                    <button
                        type="button"
                        className="text-blue-500 ml-2"
                        onClick={handleToggle}
                    >
                        {isLogin ? 'Sign Up' : 'Login'}
                    </button>
                </p>
            </div>
        </div>
    );
}