import React from 'react'
import { Pagination } from 'antd'
function CardList({ className, jagsaalt = [], keyValue, pagination, Component, componentProps }) {
    return (
        <div className={`space-y-3 p-1 bg-gray-300 dark:bg-gray-700 mt-1 ${className}`}>
            {Component && jagsaalt.map((mur, index) => <Component  {...mur}{...componentProps} key={`${keyValue}${index}`} />)}
            {!!pagination && !!pagination?.pageSize && <Pagination {...pagination} />}
        </div>
    )
}

export default CardList
