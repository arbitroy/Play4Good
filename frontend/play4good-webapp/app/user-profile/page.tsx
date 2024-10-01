'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import getCookie from '../utils/cookieHandler';
import useStorage from '../utils/useStorage';
import Modal from './Modal';
import { compressImage } from '../utils/compressImage';
import { Trophy, Users, Heart, Edit2, Gift } from 'lucide-react';

type SearchParamProps = {
    searchParams: Record<string, string> | null | undefined;
};

type User = {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar_url: string;
};

type FormData = {
    username: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string;
};

type ApiResponse = {
    id: number;
    username: string;
    email: string;
    password_hash: string;
    first_name: { String: string; Valid: boolean };
    last_name: { String: string; Valid: boolean };
    avatar_url: { String: string; Valid: boolean };
    created_at: { Time: string; Valid: boolean };
    updated_at: { Time: string; Valid: boolean };
};

type Achievement = {
    id: number;
    name: string;
    description: string;
    icon: string;
};

type TeamMember = {
    id: number;
    name: string;
    avatar: string;
};

type Donation = {
    id: number;
    cause: string;
    amount: number;
    date: string;
};

const Page = ({ searchParams }: SearchParamProps) => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const { getItem, setItem } = useStorage();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [user, setUser] = useState<User>({
        id: '',
        username: '',
        firstName: '',
        lastName: '',
        email: '',
        avatar_url: '',
    });

    const [formData, setFormData] = useState<FormData>({
        username: '',
        first_name: '',
        last_name: '',
        email: '',
        avatar_url: '',
    });

    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: 1, name: "First Donation", description: "Made your first donation", icon: "🎉" },
        { id: 2, name: "Team Player", description: "Joined a team", icon: "🤝" },
        { id: 3, name: "Generous Giver", description: "Donated over $100", icon: "💰" },
    ]);

    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
        { id: 1, name: "Alice", avatar: "/person-placeholder.svg" },
        { id: 2, name: "Bob", avatar: "/person-placeholder.svg" },
        { id: 3, name: "Charlie", avatar: "/person-placeholder.svg" },
    ]);

    const [recentDonations, setRecentDonations] = useState<Donation[]>([
        { id: 1, cause: "Clean Water Initiative", amount: 50, date: "2023-06-15" },
        { id: 2, cause: "Education for All", amount: 75, date: "2023-06-10" },
        { id: 3, cause: "Wildlife Conservation", amount: 100, date: "2023-06-05" },
    ]);

    const router = useRouter();
    const searchParamsObj = useSearchParams();
    const show = searchParams?.show === 'true';

    useEffect(() => {
        const loadedUser = {
            id: getItem('id') || '',
            username: getItem('username') || '',
            firstName: getItem('first_name') || '',
            lastName: getItem('last_name') || '',
            email: getItem('email') || '',
            avatar_url: getItem('avatarUrl') || 'https://bootdey.com/img/Content/avatar/avatar7.png',
        };
        setUser(loadedUser);
        setFormData({
            username: loadedUser.username,
            first_name: loadedUser.firstName,
            last_name: loadedUser.lastName,
            email: loadedUser.email,
            avatar_url: loadedUser.avatar_url,
        });
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError('File size should not exceed 5MB');
                return;
            }

            try {
                const compressedImageUrl = await compressImage(file, 0.8);
                setFormData((prevData) => ({
                    ...prevData,
                    avatar_url: compressedImageUrl,
                }));
            } catch (error) {
                setError('Image compression failed');
                console.error('Image compression error:', error);
            }
        }
    };

    const validateForm = (): boolean => {
        if (!formData.username.trim()) {
            setError('Username is required');
            return false;
        }
        if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
            setError('Valid email is required');
            return false;
        }
        return true;
    };

    const updateProfile = async () => {
        if (!validateForm()) return;

        try {
            const token = getCookie('token');
            if (!token) {
                setError('Authentication token is missing. Please log in again.');
                return;
            }

            const response = await fetch(`${api_url}/api/users/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data: ApiResponse = await response.json();

            const updatedUser: User = {
                id: data.id.toString(),
                username: data.username,
                firstName: data.first_name.Valid ? data.first_name.String : '',
                lastName: data.last_name.Valid ? data.last_name.String : '',
                email: data.email,
                avatar_url: data.avatar_url.Valid ? data.avatar_url.String : user.avatar_url,
            };

            setUser(updatedUser);

            setItem('id', updatedUser.id);
            setItem('username', updatedUser.username);
            setItem('first_name', updatedUser.firstName);
            setItem('last_name', updatedUser.lastName);
            setItem('email', updatedUser.email);
            setItem('avatarUrl', updatedUser.avatar_url);

            setSuccessMessage('Profile updated successfully!');
            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            if (error instanceof Error) {
                setError(`Failed to update profile: ${error.message}`);
            } else {
                setError('An unexpected error occurred');
            }
            console.error('There was an error!', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const openModal = () => {
        const currentPath = window.location.pathname;
        const updatedQuery = new URLSearchParams(searchParamsObj);
        updatedQuery.set('show', 'true');
        router.push(`${currentPath}?${updatedQuery.toString()}`);
    };

    const closeModal = () => {
        const currentPath = window.location.pathname;
        const updatedQuery = new URLSearchParams(searchParamsObj);
        updatedQuery.delete('show');
        router.push(`${currentPath}?${updatedQuery.toString()}`);
    };

    return (
        <div className="min-h-screen  py-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-xl rounded-lg overflow-hidden">
                    <div className="p-6 md:p-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <div className="md:w-1/3 mb-6 md:mb-0">
                                <Image
                                    src={user.avatar_url}
                                    alt="Avatar"
                                    width={200}
                                    height={200}
                                    className="rounded-full mx-auto"
                                />
                            </div>
                            <div className="md:w-2/3 md:pl-8">
                                <div className="flex justify-between items-center mb-4">
                                    <h1 className="text-3xl font-bold text-gray-800">
                                        {user.firstName} {user.lastName}
                                    </h1>
                                    <button
                                        onClick={openModal}
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300"
                                    >
                                        <Edit2 size={20} />
                                    </button>
                                </div>
                                <p className="text-gray-600 mb-4">@{user.username}</p>
                                <p className="text-gray-700 mb-2">
                                    <strong>Email:</strong> {user.email}
                                </p>
                                <p className="text-gray-700">
                                    <strong>Member since:</strong> June 1, 2023
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-blue-50 p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                                    <Trophy className="mr-2" /> Achievements
                                </h2>
                                <ul className="space-y-2">
                                    {achievements.map((achievement) => (
                                        <li key={achievement.id} className="flex items-center">
                                            <span className="text-2xl mr-2">{achievement.icon}</span>
                                            <div>
                                                <p className="font-medium">{achievement.name}</p>
                                                <p className="text-sm text-gray-600">{achievement.description}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="bg-green-50 p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                                    <Users className="mr-2" /> Current Team
                                </h2>
                                <div className="flex flex-wrap gap-4">
                                    {teamMembers.map((member) => (
                                        <div key={member.id} className="flex flex-col items-center">
                                            <Image
                                                src={member.avatar}
                                                alt={member.name}
                                                width={50}
                                                height={50}
                                                className="rounded-full"
                                            />
                                            <p className="mt-1 text-sm">{member.name}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-pink-50 p-6 rounded-lg shadow">
                                <h2 className="text-xl font-semibold text-pink-800 mb-4 flex items-center">
                                    <Gift className="mr-2" /> Recent Donations
                                </h2>
                                <ul className="space-y-2">
                                    {recentDonations.map((donation) => (
                                        <li key={donation.id} className="flex justify-between items-center">
                                            <span>{donation.cause}</span>
                                            <span className="font-medium">${donation.amount}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {show && (
                <Modal onClose={closeModal}>
                    <div className="rounded-lg max-w-md mx-auto text-center">
                        <h2 className="text-2xl font-bold mb-2.5">Edit Profile</h2>
                        <p className="text-base mb-5">
                            Here you can edit your profile information.
                        </p>
                        <div className="mb-5">
                            <Image
                                src={formData.avatar_url || user.avatar_url}
                                alt="Avatar"
                                width={200}
                                height={200}
                                className="rounded-full mx-auto"
                            />
                        </div>

                        {error && <div className="text-red-500 mb-2">{error}</div>}
                        {successMessage && <div className="text-green-500 mb-2">{successMessage}</div>}

                        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                            <label className="block text-sm mb-2.5 cursor-pointer">
                                Choose Profile Picture
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </label>

                            <input
                                type="text"
                                placeholder="Username"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                required
                                className="p-2.5 text-base border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="First Name"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleChange}
                                className="p-2.5 text-base border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="text"
                                placeholder="Last Name"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleChange}
                                className="p-2.5 text-base border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                            />
                            <input
                                type="email"
                                placeholder="Email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="p-2.5 text-base border border-gray-300 rounded-md w-full focus:outline-none focus:border-blue-500"
                            />
                            <button type="submit" className="py-2.5 px-5 bg-blue-600 text-white border-none rounded-md cursor-pointer text-base hover:bg-blue-700">
                                Submit
                            </button>
                        </form>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Page;