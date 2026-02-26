import React from 'react';

export default function AppLogoIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            {/* Minimalist, Sharp HRIS Logo */}
            {/* Represents a stylized "H" with upward growth/people focus */}
            <path
                d="M5 4V20M19 4V20M6 12H18"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="12" cy="7" r="2" fill="currentColor" />
            <path
                d="M10 20C10 17.7909 10.8954 16 12 16C13.1046 16 14 17.7909 14 20"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
            />
        </svg>
    );
}
