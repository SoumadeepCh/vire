"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "../components/Notification";
import Link from "next/link";

export default function Login() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();
	const { showNotification } = useNotification();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const result = await signIn("credentials", {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			showNotification(result.error, "error");
		} else {
			showNotification("Login successful!", "success");
			router.push("/");
		}
	};

	return (
		<div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
			<div className="max-w-md w-full bg-gray-800 rounded-lg shadow-2xl p-8 border border-gray-700">
				<div className="text-center mb-8">
					<h1 className="text-3xl font-bold text-white mb-2">
						Welcome Back
					</h1>
					<p className="text-gray-400">Sign in to your account</p>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-300 mb-2">
							Email Address
						</label>
						<input
							type="email"
							id="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							required
							className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
							placeholder="Enter your email"
						/>
					</div>

					<div>
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-300 mb-2">
							Password
						</label>
						<input
							type="password"
							id="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
							className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
							placeholder="Enter your password"
						/>
					</div>

					<button
						type="submit"
						className="w-full bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold py-3 px-4 rounded-lg hover:from-green-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform hover:scale-[1.02] transition-all duration-200 shadow-lg">
						Sign In
					</button>

					<div className="flex items-center justify-center">
						<div className="border-t border-gray-600 flex-grow"></div>
						<span className="px-4 text-gray-400 text-sm">or</span>
						<div className="border-t border-gray-600 flex-grow"></div>
					</div>

					<p className="text-center text-gray-400">
						Don&apos;t have an account?{" "}
						<Link
							href="/register"
							className="text-green-400 hover:text-green-300 font-medium transition-colors duration-200 hover:underline">
							Create one here
						</Link>
					</p>
				</form>
			</div>
		</div>
	);
}
