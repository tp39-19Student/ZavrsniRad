

export default function MultiButton({vals, selected, onSelect}: {vals: string[], selected: number, onSelect: (n: number) => any}) {

    return (
        <div className="multibutton">
            {vals.map((el, i) =>
                <button
                    key={i}
                    className={"btn " + ((selected == i)?"btn-primary":"btn-secondary")} 
                    onClick={() => onSelect(i)}
                >
                    {el}
                </button>
            )}
        </div>
    );
}