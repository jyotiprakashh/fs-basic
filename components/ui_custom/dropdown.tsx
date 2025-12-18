export function CustomDropdownItem({ 
    children, 
    onClick,
    className = ""
}: { 
    children: React.ReactNode, 
    onClick?: (e: React.MouseEvent) => void,
    className?: string
}) {
    return (
        <div 
            className={`px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900 cursor-pointer ${className}`}
            onClick={onClick}
        >
            {children}
        </div>
    );
}