import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

const Layout = ({ children }) => {
    return (
        <div className="flex h-screen bg-hero-glow text-mist overflow-hidden">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                {/* Ambient Glow Effects */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                    <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-neon-blue/10 rounded-full blur-[128px]"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-neon-purple/10 rounded-full blur-[128px]"></div>
                </div>

                <Header />
                <main className="flex-1 overflow-y-auto p-4 md:p-8 relative z-10 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent pb-24 md:pb-8">
                    {children}
                </main>
                <MobileNav />
            </div>
        </div>
    );
};

export default Layout;
