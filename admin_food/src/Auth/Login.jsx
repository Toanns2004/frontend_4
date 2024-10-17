import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        const credentials = { email, password };

        try {
            const response = await axios.post("http://localhost:8080/auth/login", credentials);

            if (response.status === 200) {
                const data = response.data;
                console.log("Server response:", data);

                // Lưu token, refreshToken, và role vào localStorage
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", JSON.stringify(data.role));

                const isAdmin = data.role.some(role => role.name === "ADMIN");
                const isChef = data.role.some(role => role.name === "CHEF");
                const isEmployee = data.role.some(role => role.name ==="EMPLOYEE");

                if (isAdmin) {
                    navigate("/admin/restaurants/");
                } else if (isChef) {
                    navigate("/chef/");
                } else if (isEmployee) {
                    navigate("/employee/");
                } else {
                    console.error("No valid role found!");
                }
            }
        } catch (error) {
            if (error.response) {
                console.error("Login failed:", error.response.data.message);
            } else {
                console.error("Something went wrong:", error.message);
            }
        }
    };


    return (
        <div className="flex h-dvh bg-slate-100 flex-1 flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <img
                    alt="Your Company"
                    src="https://w7.pngwing.com/pngs/636/819/png-transparent-computer-icons-privacy-policy-admin-icon-copyright-rim-share-icon-thumbnail.png"
                    className="mx-auto h-10 w-auto"
                />
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
                    Đăng nhập
                </h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                            Địa chỉ Email
                        </label>
                        <div className="mt-2">
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm"
                                placeholder="Nhập địa chỉ email"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                            Mật khẩu
                        </label>
                        <div className="mt-2">
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 py-3 px-4 text-gray-900 shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent sm:text-sm"
                                placeholder="Nhập mật khẩu"
                            />

                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500">
                            Đăng nhập
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;
