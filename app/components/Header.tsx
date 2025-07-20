"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Home, User, Upload, LogOut, LogIn, ChevronDown } from "lucide-react";
import { useNotification } from "./Notification";
import { useState } from "react";

export default function Header() {
	const { data: session } = useSession();
	const { showNotification } = useNotification();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const handleSignOut = async () => {
		try {
			await signOut();
			showNotification("Signed out successfully", "success");
			setDropdownOpen(false);
		} catch {
			showNotification("Failed to sign out", "error");
		}
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const closeDropdown = () => {
		setDropdownOpen(false);
	};

	return (
		<nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-xl border-b border-emerald-500/20 shadow-2xl">
			{/* Gradient overlay for depth */}
			<div className="absolute inset-0 bg-gradient-to-r from-gray-900/50 via-slate-800/50 to-gray-900/50 pointer-events-none"></div>

			<div className="relative container mx-auto px-6">
				<div className="flex items-center justify-between h-16">
					{/* Logo Section */}
					<div className="flex items-center space-x-4">
						<Link
							href="/"
							className="group flex items-center space-x-3 px-4 py-2 rounded-xl hover:bg-emerald-500/10 transition-all duration-300"
							prefetch={true}
							onClick={() => showNotification("Vire", "info")}>
							<div className="relative">
								<Home className="w-6 h-6 text-emerald-400 group-hover:text-emerald-300 transition-colors duration-300" />
								<div className="absolute -inset-1 bg-emerald-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
							<div className="flex items-center space-x-2">
								<span className="text-2xl font-black bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400 bg-clip-text text-transparent tracking-tight">
									Vire
								</span>
								<div className="h-1 w-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
							</div>
						</Link>
					</div>

					{/* User Menu Section */}
					<div className="flex items-center space-x-4">
						{/* Status Indicator */}
						<div className="hidden md:flex items-center space-x-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-2">
							<div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse shadow-lg shadow-emerald-400/50"></div>
							<span className="text-emerald-300 text-sm font-medium">
								Online
							</span>
						</div>

						{/* User Dropdown */}
						<div className="relative">
							<button
								onClick={toggleDropdown}
								className="group flex items-center space-x-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 hover:border-emerald-500/30 rounded-xl px-4 py-2 transition-all duration-300">
								<div className="relative">
									<User className="w-5 h-5 text-gray-400 group-hover:text-emerald-400 transition-colors duration-300" />
									<div className="absolute -inset-1 bg-emerald-400/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
								</div>
								{session && (
									<span className="hidden sm:block text-gray-300 text-sm font-medium">
										{session.user?.email?.split("@")[0]}
									</span>
								)}
								<ChevronDown
									className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${
										dropdownOpen ? "rotate-180" : ""
									}`}
								/>
							</button>

							{/* Dropdown Menu */}
							{dropdownOpen && (
								<>
									{/* Backdrop */}
									<div
										className="fixed inset-0 z-40"
										onClick={closeDropdown}></div>

									{/* Dropdown Content */}
									<div className="absolute right-0 mt-2 w-72 bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/20 z-50 overflow-hidden">
										{/* Gradient overlay */}
										<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-teal-500/5 pointer-events-none"></div>

										<div className="relative p-2">
											{session ? (
												<>
													{/* User Info Section */}
													<div className="px-4 py-3 border-b border-gray-700/30">
														<div className="flex items-center space-x-3">
															<div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
																<User className="w-5 h-5 text-white" />
															</div>
															<div>
																<p className="text-white font-semibold">
																	{
																		session.user?.email?.split(
																			"@"
																		)[0]
																	}
																</p>
																<p className="text-gray-400 text-sm">
																	{
																		session
																			.user
																			?.email
																	}
																</p>
															</div>
														</div>
														<div className="mt-3 flex items-center space-x-2">
															<div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse"></div>
															<span className="text-emerald-300 text-xs font-medium">
																Active Session
															</span>
														</div>
													</div>

													{/* Menu Items */}
													<div className="py-2 space-y-1">
														<Link
															href="/upload"
															className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200 group"
															onClick={() => {
																showNotification(
																	"Welcome to Admin Dashboard",
																	"info"
																);
																closeDropdown();
															}}>
															<Upload className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
															<span className="font-medium">
																Video Upload
															</span>
														</Link>

														<button
															onClick={
																handleSignOut
															}
															className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-500/10 rounded-xl transition-all duration-200 group">
															<LogOut className="w-5 h-5 text-red-400 group-hover:text-red-300" />
															<span className="font-medium">
																Sign Out
															</span>
														</button>
													</div>
												</>
											) : (
												<div className="py-2">
													<Link
														href="/login"
														className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:text-white hover:bg-emerald-500/10 rounded-xl transition-all duration-200 group"
														onClick={() => {
															showNotification(
																"Please sign in to continue",
																"info"
															);
															closeDropdown();
														}}>
														<LogIn className="w-5 h-5 text-emerald-400 group-hover:text-emerald-300" />
														<span className="font-medium">
															Sign In
														</span>
													</Link>
												</div>
											)}
										</div>
									</div>
								</>
							)}
						</div>
					</div>
				</div>
			</div>
		</nav>
	);
}
