
export default function Pagination({current, total, onPageChange}: 
    {
        current: number;
        total: number;
        onPageChange: (newPage: number) => any;
    }
) {
    if (total <= 1) return null;
    return(
        <nav>
            <ul className="pagination">
                <li className="page-item">
                    <a
                        className={"page-link" + ((current == 0)?" disabled":"")}
                        onClick={() => onPageChange(current - 1)}
                    >
                        Previous
                    </a>
                </li>
                {[...Array(total).keys()].map(i =>
                    <li key={i} className="page-item">
                        <a
                            className={"page-link" + ((current == i)?" active":"")}
                            onClick={() => onPageChange(i)}
                        >
                            {i + 1}
                        </a>
                    </li>
                )}
                <li className="page-item">
                    <a
                        className={"page-link" + ((current == total - 1)?" disabled":"")}
                        onClick={() => onPageChange(current + 1)}
                    >
                        Next
                    </a>
                </li>
            </ul>
        </nav>
    );
}