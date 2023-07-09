import { useState } from 'react'
import AsideList from './AsideList'

export default function Sidebar({ categorizedTools }) {
    const [showCategories, setShowCategories] = useState(false);
    const handleCategoriesHover = () => {
        setShowCategories(true);
    };
    const handleCategoriesLeave = () => {
        setShowCategories(false);
    };
    return (
        <>
            <AsideList categorizedTools={categorizedTools} />
        </>
    );
};