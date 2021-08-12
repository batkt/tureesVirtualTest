import React, { useState, useContext, createContext, useMemo, useEffect } from 'react'
import { message } from 'antd';
import { setCookie, parseCookies } from 'nookies';
import uilchilgee, { aldaaBarigch } from './uilchilgee'
import { ekhniiTsonkhruuOchyo } from 'tools/logic/khereglegchiinErkhiinTokhirgoo'
import { mutate } from 'swr'
import useAjiltan from 'hooks/useAjiltan';
import { useRouter } from 'next/router'
import useBaiguullaga from 'hooks/useBaiguullaga';
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    const router = useRouter()
    const [token, setToken] = useState(null)
    const [ajiltniiJagsaalt, setAjiltniiJagsaalt] = useState([])
    const { ajiltan, ajiltanMutate } = useAjiltan(token);
    const { baiguullaga, baiguullagaMutate } = useBaiguullaga(token, ajiltan?.baiguullagiinId)

    useEffect(() => {
        const t = parseCookies()
        setToken(t?.tureestoken)
        const la = localStorage.getItem('ajiltniiJagsaalt')
        if (!!la)
            setAjiltniiJagsaalt(JSON.parse(la))
        window.addEventListener('online', () => message.success('Интернэт ертөнцөд тавтай морил'));
        window.addEventListener('offline', () => message.warning('Таны интернэт тасарсан байна'));
        return () => {
            window.removeEventListener('online', () => message.success('Интернэт ертөнцөд тавтай морил'));
            window.removeEventListener('offline', () => message.warning('Таны интернэт тасарсан байна'));
        }
    }, [])

    const auth = useMemo(() => ({
        newterya: async khereglech => {
            if (khereglech.namaigsana)
                localStorage.setItem('newtrekhNerTurees', khereglech.ner)

            uilchilgee().post('/ajiltanNevtrey', khereglech).then(({ data, status }) => {
                if (status === 200) {
                    if (!!data) {
                        setCookie(null, 'tureestoken', data._id, {
                            maxAge: 30 * 24 * 60 * 60,
                            path: '/',
                        })
                        setToken(data._id)
                        ajiltanMutate(data)
                        ekhniiTsonkhruuOchyo(data.role, '/' + data._id)
                        message.success('Тавтай морил')
                    }
                    else message.error('Хэрэглэгчийн мэдээлэл буруу байна')
                }
                else
                    message.error('Хэрэглэгчийн мэдээлэл буруу байна')
            }).catch(aldaaBarigch)

        },
        ajiltanNemya: async khereglech => {
            uilchilgee().post('/ajiltanNevtrey', khereglech).then(({ data, status }) => {
                if (status === 200) {
                    if (!!data.token && (data?.result?.erkh === 'Zasvarchin' || data?.result?.erkh === 'Injener')) {
                        const index = ajiltniiJagsaalt.findIndex(a => a._id === data?.result?._id)
                        if (index !== -1) {
                            message.warning('Тухайн ажилтанаар орсон байна')
                            return
                        }
                        const { erkh, ner, zurgiinNer, baiguullagiinId, _id } = data.result
                        let a = { token: data.token, erkh, ner, zurgiinNer, baiguullagiinId, _id }
                        ajiltniiJagsaalt.push(a)
                        localStorage.setItem('ajiltniiJagsaalt', JSON.stringify(ajiltniiJagsaalt))
                        setAjiltniiJagsaalt(ajiltniiJagsaalt)
                        setCookie(null, 'tureestoken', data.token, {
                            maxAge: 30 * 24 * 60 * 60,
                            path: '/',
                        })
                        setToken(data.token)
                        ajiltanMutate(data.result)
                        ekhniiTsonkhruuOchyo(data.result.erkh, '/' + data.result._id)
                        message.success('Тавтай морил')
                    }
                    else message.error('Хэрэглэгчийн мэдээлэл буруу байна')
                }
                else
                    message.error('Хэрэглэгчийн мэдээлэл буруу байна')
            }).catch(aldaaBarigch)
        },
        ajiltanKhasya: async khereglech => {
            if (ajiltniiJagsaalt.length === 1)
                return
            const index = ajiltniiJagsaalt.findIndex(a => a._id === khereglech._id)
            ajiltniiJagsaalt.splice(index, 1)

            if (khereglech._id === ajiltan._id) {
                setToken(ajiltniiJagsaalt[0].token)
                router.replace("/khyanalt/ajiltanKhyanalt/ajiltaniiZakhialguud/" + ajiltniiJagsaalt[0]._id)
            }
            localStorage.setItem('ajiltniiJagsaalt', JSON.stringify(ajiltniiJagsaalt))
            setAjiltniiJagsaalt([...ajiltniiJagsaalt])
        },
        garya: () => {
            window.location.href = "/";
        },
        baiguullagaShinechilya: () => {
            mutate('/baiguullagaAvya')
        },
        token,
        ajiltan,
        baiguullaga,
        baiguullagaMutate,
        ajiltanMutate,
        setToken,
        ajiltniiJagsaalt
    }), [token, ajiltan, baiguullaga, ajiltniiJagsaalt])

    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext);