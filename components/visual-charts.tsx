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
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorXP" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FB923C" stopOpacity={0.5} />
                        <stop offset="95%" stopColor="#FB923C" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.05} />
                <XAxis dataKey="date" fontSize={10} tickLine={false} axisLine={false} interval={4} tick={{ fill: '#888' }} />
                <YAxis fontSize={10} tickLine={false} axisLine={false} tickCount={5} tick={{ fill: '#888' }} />
                <ReTooltip
                    contentStyle={{
                        borderRadius: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(8px)',
                        boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.5)',
                        fontSize: '11px',
                        fontWeight: 'bold',
                        color: '#fff'
                    }}
                    itemStyle={{ color: '#FB923C' }}
                    cursor={{ stroke: '#FB923C', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area
                    type="monotone"
                    dataKey="xp"
                    name="XP Gained"
                    stroke="#FB923C"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorXP)"
                    dot={{ r: 4, fill: '#FB923C', strokeWidth: 2, stroke: '#fff' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    animationDuration={1500}
                />
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
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.05} />
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" width={100} fontSize={10} axisLine={false} tickLine={false} tick={{ fill: '#888', fontWeight: 'bold' }} />
                <ReTooltip
                    cursor={{ fill: 'rgba(251, 146, 60, 0.05)', radius: 8 }}
                    contentStyle={{
                        borderRadius: '12px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.8)',
                        backdropFilter: 'blur(4px)',
                        fontSize: '10px'
                    }}
                />
                <Bar
                    dataKey="percent"
                    fill="#FB923C"
                    radius={[0, 8, 8, 0]}
                    barSize={20}
                    animationDuration={1500}
                    label={{ position: 'right', fill: '#FB923C', fontSize: 10, fontWeight: 'bold', formatter: (v: number) => `${v}%` }}
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
