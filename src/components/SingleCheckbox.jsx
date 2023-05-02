export default function SingleCheckbox({ prompt, value, setValue }) {
    return (
        <label className="label cursor-pointer">
            <span
                className="
          label-text 
          text-xl 
          text-black mr-2
          "
            >
                {prompt}
            </span>
            <input
                checked={value}
                onChange={() => {
                    setValue(!value);
                }}
                type="checkbox"
                className="checkbox border-2 checkbox-secondary"
            />
        </label>
    );
}
