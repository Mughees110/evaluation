import React, { useState, useEffect } from 'react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { Link } from '@inertiajs/react';
export default function Dashboard({ auth }) {
    const [walletAddress, setWalletAddress] = useState('');
    const [chainId, setChainId] = useState('');
    const [install, setInstall] = useState(false);
    const [cryptoPrice, setCryptoPrice] = useState(null);
    const [selectedCrypto, setSelectedCrypto] = useState('bitcoin');
    const [isSaving, setIsSaving] = useState(false);

    const handleCreateWallet = async () => {
        if (window.ethereum) {
            try {
                // Request account access from MetaMask
                await window.ethereum.request({ method: 'eth_requestAccounts' });
                // Get the current account from MetaMask
                const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                // Generate a new wallet address using MetaMask
                const newWalletAddress = accounts[0];
                setWalletAddress(newWalletAddress);
                // Send the new wallet address to the backend for storage
            } catch (error) {
                console.error('Error creating wallet:', error);
            }
        } else {
            console.error('MetaMask is not installed');
            alert('Please install MetaMask to create a wallet.');
            setInstall(true);
        }
    };

    useEffect(() => {
        // Fetch the chain ID from MetaMask when the component mounts
        const fetchChainId = async () => {
            if (window.ethereum) {
                try {
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    setChainId(chainId);
                } catch (error) {
                    console.error('Error fetching chain ID:', error);
                }
            } else {
                console.error('MetaMask is not installed');
                // alert('Please install MetaMask to create a wallet.');
                setInstall(true);
            }
        };
        fetchChainId();
    }, []);

    useEffect(() => {
        const fetchCryptoPrice = async () => {
            try {
                const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${selectedCrypto}&vs_currencies=usd`);
                const data = await response.json();
                setCryptoPrice(data[selectedCrypto].usd);
            } catch (error) {
                console.error('Error fetching crypto price:', error);
            }
        };

        fetchCryptoPrice();
    }, [selectedCrypto]);

    const handleCryptoChange = (e) => {
        setSelectedCrypto(e.target.value);
    };
    const csrfToken = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');

    const handleStoreWalletAddress = async () => {
        setIsSaving(true);
        try {
            const response = await fetch('/api/store-wallet-address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': csrfToken
                },
                
                body: JSON.stringify({ address: walletAddress,userId:auth.user.id }),
            });

            if (response.ok) {
                alert('Address saved successfully');
            } else {
                alert('Failed to save address');
            }
        } catch (error) {
            console.error('Error saving wallet address:', error);
            alert('Error saving wallet address');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            You're logged in!<br />

                            <button onClick={handleCreateWallet} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4">
                                Get wallet Address
                            </button>&nbsp;&nbsp;
                            <Link
                                href={route('stripee')}
                                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                            >
                                STRIPE
                            </Link>
                            {walletAddress && (
                                <div>
                                    <p>Your new wallet address: {walletAddress}</p>
                                    <button 
                                        onClick={handleStoreWalletAddress} 
                                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-4"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? 'Saving...' : 'Store in Database'}
                                    </button>
                                </div>
                            )}
                            <br></br><br></br>
                            {chainId && <p>Chain ID: {chainId}</p>}
                            {install && (
                                <button onClick={() => window.open('https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn', '_blank')}>
                                    Install MetaMask Extension
                                </button>
                            )}
                        </div>
                        <div className='text-center'>
                        <h2>Selected Cryptocurrency Price</h2><br></br>
                        <select value={selectedCrypto} onChange={handleCryptoChange}>
                            <option value="bitcoin">Bitcoin</option>
                            <option value="ethereum">Ethereum</option>
                            {/* Add more options for other cryptocurrencies */}
                        </select>
                        <br></br><br></br>
                        {cryptoPrice ? (
                            <p>The price of {selectedCrypto} is ${cryptoPrice}</p>
                        ) : (
                            <p>Loading...</p>
                        )}
                    </div>
                    </div>
                    
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
