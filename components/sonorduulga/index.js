import React from 'react'
import SanalaGomdol from './dedKheseg/SanalaGomdol'
function index({ turul, ...busad }) {
    return <SanalaGomdol {...busad} />
}

export default index
