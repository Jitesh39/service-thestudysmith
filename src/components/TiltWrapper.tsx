"use client";

import { Tilt } from 'react-tilt';
import { ReactNode } from 'react';

const defaultOptions = {
    reverse: false,  // reverse the tilt direction
    max: 15,     // max tilt rotation (degrees) - KEEP SUBTLE
    perspective: 1000,   // Transform perspective, the lower the more extreme the tilt gets.
    scale: 1.02,   // 2 = 200%, 1.5 = 150%, etc..
    speed: 1000,   // Speed of the enter/exit transition
    transition: true,   // Set a transition on enter/exit.
    axis: null,   // What axis should be disabled. Can be X or Y.
    reset: true,   // If the tilt effect has to be reset on exit.
    easing: "cubic-bezier(.03,.98,.52,.99)",    // Easing on enter/exit.
}

export default function TiltWrapper({ children, className = "", options = {} }: { children: ReactNode, className?: string, options?: any }) {
    return (
        <Tilt options={{ ...defaultOptions, ...options }} className={className}>
            {children}
        </Tilt>
    );
}
