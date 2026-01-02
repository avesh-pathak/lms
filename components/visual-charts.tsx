"use client"

import React from "react"
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ReTooltip,
    ResponsiveContainer, AreaChart, Area
} from "recharts"

interface AreaChartProps {
    data: any[]
}

export function XPVelocityChart({ data }: AreaChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
                <defs>
                    <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} interval={4} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickCount={5} />
                <ReTooltip
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="xp" name="XP Gained" stroke="#FB923C" strokeWidth={4} fillOpacity={1} fill="url(#colorXP)" />
            </AreaChart>
        </ResponsiveContainer>
    )
}

interface BarChartProps {
    data: any[]
}

export function MasteryBarChart({ data }: BarChartProps) {
    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={10} axisLine={false} tickLine={false} />
                <ReTooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="percent" fill="#FB923C" radius={[0, 4, 4, 0]} barSize={16} />
            </BarChart>
        </ResponsiveContainer>
    )
}
