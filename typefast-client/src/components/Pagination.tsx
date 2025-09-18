
export default function Pagination({current, total, onPageChange, maxWidth = 8}: 
    {
        current: number;
        total: number;
        onPageChange: (newPage: number) => any;
        maxWidth?: number;
    }
) {
    if (total <= 1) return null;
    return(
        <nav>
            <ul className={"pagination" + ((maxWidth<6)?" pagination-sm":"")}>
                <li className="page-item">
                    <a
                        className={"page-link" + ((current == 0)?" disabled":"")}
                        onClick={() => onPageChange(current - 1)}
                    >
                        Previous
                    </a>
                </li>
                {shownKeys().map(i =>
                    {
                        if (i == -1) return <li className="page-item disabled"><a className="page-link">...</a></li>
                        return (<li key={i} className="page-item">
                            <a
                                className={"page-link" + ((current == i)?" active":"")}
                                onClick={() => onPageChange(i)}
                            >
                                {i + 1}
                            </a>
                        </li>);
                    }
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

    function shownKeys() {
        const width = (maxWidth >= 6)?maxWidth:2*maxWidth;

        let left = current - Math.floor(width/2);
        let right = current + Math.floor(width/2);

        if (left < 0) {
            right -= left;
            left = 0;
        }

        if (right >= total) {
            left -= (right - total + 1);
            right = total - 1;
            if (left < 0) left = 0;
        }

        if (left <= 2) left = 0;
        if (right >= total - 3) right = total - 1;

        let res = [];
        if (left > 0) {
            res.push(0);
            res.push(-1);
        }

        for (let i = left; i <= right; i++) res.push(i);

        if (right < total - 1) {
            res.push(-1);
            res.push(total - 1);
        }

        return res;
    }
}