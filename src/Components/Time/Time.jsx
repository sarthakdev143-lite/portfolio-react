import React, { useEffect, useState } from 'react'
import './Time.css'

const Time = () => {
    const [time, setTime] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', {
            hour12: false,
            hour: '2-digit',
            minute: '2-digit',
            day: 'numeric',
            weekday: 'short',
        })
    }

    return (
        <section id="time">
            <h1>
                <span className="location">📍 <span className='name'>Indore,</span></span>
                <span className="time-display">{formatTime(time)}</span>
            </h1>
        </section>
    )
}

export default Time