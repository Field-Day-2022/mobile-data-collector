import { useAtomValue, useSetAtom } from 'jotai';
import { currentFormName, currentSessionData } from '../utils/jotai';

export default function NewDataEntry() {
    const currentData = useAtomValue(currentSessionData);
    const setCurrentForm = useSetAtom(currentFormName);

    const entryTypes = ['Arthropod', 'Amphibian', 'Lizard', 'Mammal', 'Snake'];

    const goToForm = (formName) => {
        setCurrentForm(formName);
    };

    const getNumberCrittersRecorded = (critter) => {
        let count = 0;
        if (critter === 'arthropod') {
            for (const dataEntry of currentData[critter]) {
                for (const key in dataEntry.arthropodData) {
                    count += Number(dataEntry.arthropodData[key]);
                }
            }
        } else if (
            critter === 'amphibian' ||
            critter === 'lizard' ||
            critter === 'mammal' ||
            critter === 'snake'
        ) {
            count += currentData[critter].length;
        }
        return count;
    };

    return (
        <div
            className="
        rounded-lg 
        w-full 
        h-full
        text-center 
        form-control 
        items-center 
        justify-start 
        overflow-x-hidden 
        overflow-y-auto
        scrollbar-thin 
        scrollbar-thumb-asu-maroon 
        scrollbar-thumb-rounded-full
      "
        >
            <p className="text-lg">{`Project: ${currentData.project}`}</p>
            <p className="text-lg">{`Site: ${currentData.site}`}</p>
            <p className="text-lg">{`Array: ${currentData.array}`}</p>
            <div className="flex w-full justify-center">
                <div className="dropdown dropdown-bottom justify-center items-center">
                    <label
                        tabIndex={0}
                        className="btn m-1 text-black text-xl capitalize font-medium bg-white border-asu-maroon border-2 hover:border-asu-maroon hover:bg-white"
                    >
                        Select Form
                    </label>
                    <ul
                        tabIndex={0}
                        className="dropdown-content menu items-center p-2 shadow bg-white rounded-box text-xl border-asu-maroon border-2"
                    >
                        {entryTypes.map((entry) => (
                            <li
                                onClick={() => {
                                    document.activeElement.blur();
                                    goToForm(`New ${entry} Entry`);
                                }}
                                className={'w-full'}
                                key={entry}
                            >
                                <p className="border-2 border-asu-maroon m-1 p-2 flex flex-col items-center">
                                    {entry}
                                </p>
                            </li>
                        ))}
                    </ul>
                </div>
                <label
                    htmlFor="my-modal-6"
                    className="btn m-1 text-black capitalize text-xl font-normal border-asu-maroon border-2 bg-white hover:bg-white hover:border-asu-maroon"
                >
                    End Session
                </label>
            </div>
            <p className="text-lg mt-2 ">{`Number of critters recorded:`}</p>
            {currentData ? (
                <div className="rounded-3xl">
                    <table className="table table-compact glass rounded-3xl">
                        <thead className="border-b-[3px] border-slate-200">
                            <tr>
                                <th className="bg-transparent rounded-tl-3xl text-center">
                                    Critter
                                </th>
                                <th className="bg-transparent rounded-tr-3xl text-center">
                                    Number
                                </th>
                            </tr>
                        </thead>
                        <tbody className="text-center">
                            <EntryTableRow
                                entryType={'Arthropod'}
                                entryNumber={getNumberCrittersRecorded('arthropod')}
                            />
                            <EntryTableRow
                                entryType={'Amphibian'}
                                entryNumber={getNumberCrittersRecorded('amphibian')}
                            />
                            <EntryTableRow
                                entryType={'Lizard'}
                                entryNumber={getNumberCrittersRecorded('lizard')}
                            />
                            <EntryTableRow
                                entryType={'Mammal'}
                                entryNumber={getNumberCrittersRecorded('mammal')}
                            />
                            <EntryTableRow
                                entryType={'Snake'}
                                entryNumber={getNumberCrittersRecorded('snake')}
                            />
                        </tbody>
                    </table>
                </div>
            ) : (
                <p className="text-lg">No previous entries</p>
            )}
            <input type="checkbox" id="my-modal-6" className="modal-toggle" />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box bg-white">
                    <h3 className="text-3xl font-bold text-black mb-2">Are you sure?</h3>
                    <p className="text-black text-md">
                        This will send the session data to the server and close it to further data
                        collection. If you want to add to this session after closing, go to the
                        "History" page and select it.
                    </p>
                    <div className="modal-action m-1 flex flex-col items-center">
                        <label
                            htmlFor="my-modal-6"
                            onClick={() => {
                                setCurrentForm('Finish Session');
                            }}
                            className="btn w-full px-2 py-3 h-min text-black normal-case my-4 font-semibold text-lg border-asu-maroon border-2 bg-white"
                        >
                            Yes, I'm done with this session
                        </label>
                        <label
                            htmlFor="my-modal-6"
                            className="btn w-full px-2 py-3 h-min text-black normal-case font-semibold text-lg border-asu-maroon border-2 bg-white hover:bg-white hover:border-asu-maroon"
                        >
                            No, I'm not finished yet
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}

const EntryTableRow = ({ entryType, entryNumber }) => {
    return (
        <tr>
            <td className="bg-transparent text-lg p-1">{entryType}</td>
            <td className="bg-transparent text-lg p-1">{entryNumber}</td>
        </tr>
    );
};
