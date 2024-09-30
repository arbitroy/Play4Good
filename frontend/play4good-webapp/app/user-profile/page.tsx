'use client';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import getCookie from '../utils/cookieHandler';
import useStorage from '../utils/useStorage';
import Modal from './Modal';
import { compressImage } from '../utils/compressImage';

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

const Page = ({ searchParams }: SearchParamProps) => {
    const api_url = process.env.NEXT_PUBLIC_API_URL;
    const { getItem, setItem } = useStorage();
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('Updated Successfully');
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // Check if file size exceeds 5MB
                setError('File size should not exceed 5MB');
                return;
            }

            try {
                const compressedImageUrl = await compressImage(file, 0.8); // Compress the image
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

            // Update localStorage
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
        <section className="py-5 relative text-white" id="about">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-wrap items-center flex-row-reverse">
                    <div className="w-full lg:w-1/2">
                        <div className="about-text relative pr-5">
                            <h3 className="text-4xl font-bold mb-1.5 text-[#20247b]">
                                Profile
                                <span className="absolute top-0 left-36 text-base cursor-pointer text-gray-600 bg-[#f0f8ff] transition-colors duration-300 p-2 rounded-full hover:text-gray-800" onClick={openModal}>
                                    <i className="fas fa-pencil-alt"></i>
                                </span>
                            </h3>
                            <h6 className="text-[#fc5356] font-semibold mb-4">
                                A team player &amp; avid supporter of charity
                            </h6>
                            <div className="flex flex-wrap pt-2.5">
                                <div className="w-full md:w-1/2">
                                    <div className="py-1.5">
                                        <label className="text-[#20247b] font-semibold w-22 m-0 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-2.5 after:w-px after:h-3 after:bg-[#20247b] after:transform after:rotate-15 after:m-auto after:opacity-50">First Name</label>
                                        <p className="m-0 text-sm">{user.firstName}</p>
                                    </div>
                                    <div className="py-1.5">
                                        <label className="text-[#20247b] font-semibold w-22 m-0 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-2.5 after:w-px after:h-3 after:bg-[#20247b] after:transform after:rotate-15 after:m-auto after:opacity-50">Last Name</label>
                                        <p className="m-0 text-sm">{user.lastName}</p>
                                    </div>
                                </div>
                                <div className="w-full md:w-1/2">
                                    <div className="py-1.5">
                                        <label className="text-[#20247b] font-semibold w-22 m-0 relative after:content-[''] after:absolute after:top-0 after:bottom-0 after:right-2.5 after:w-px after:h-3 after:bg-[#20247b] after:transform after:rotate-15 after:m-auto after:opacity-50">E-mail</label>
                                        <p className="m-0 text-sm">{user.email}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-1/2">
                        <div className="about-avatar">
                            <Image
                                src={user.avatar_url}
                                alt="Avatar"
                                width={350}
                                height={350}
                                className="rounded-full"
                            />
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
        </section>
    );
};

export default Page;