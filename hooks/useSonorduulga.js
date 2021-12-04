import {  useState } from 'react'

function useSonorduulga(token, ajiltniiId) {
    const [khuudaslalt, setKhuudaslalt] = useState({ khuudasniiDugaar: 1, khuudasniiKhemjee: 10, jagsaalt: [] })
    const { data, mutate } = {}

    return { setKhuudaslalt, sonorduulga: data, sonorduulgaMutate: mutate, jagsaalt: khuudaslalt.jagsaalt }
}

export default useSonorduulga