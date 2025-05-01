export default function AboutUs() {
    const teams = [
        {
            year: '2024-2025',
            names: [
                'Quinten Knowles',
                'Ayesha Arif',
                'Timothy Weaver',
                'Chase Molstad',
                'Evan Hagood',
            ],
        },
        {
            year: '2022-2023',
            names: [
                'Isaiah Lathem',
                'Ian Skelskey',
                'Jack Norman',
                'Dennis Grassl',
                'Zachary Jacobson',
            ],
        },
        {
            year: '2020-2021',
            names: ['Brent Garcia', 'Alexander Mack', 'Amy Kiely', 'Phil McElroy', 'Carlo Pelosi'],
        },
        {
            year: '2019-2020',
            names: [
                'Colton Wiethorn',
                'Kevin Shelley',
                'Kimberlee Gentry',
                'Marcella Sellers',
                'Taryn Betz',
            ],
        },
        {
            year: '2018-2019',
            names: [
                'Ashley Giamona',
                'Edward Woelke',
                'Joshua Owczarek',
                'Matt Kharrl',
                'Phil Soucheray',
            ],
        },
    ];

    return (
        <div className="w-full overflow-y-scroll flex flex-col items-center">
            <h1 className="text-2xl">Wildlife Data Collection & Query</h1>
            <h2 className="text-xl">Previous Capstone Teams</h2>
            <div className="w-2/3">
                {teams.map((team) => (
                    <Section title={team.year} names={team.names} />
                ))}
            </div>
        </div>
    );
}

const Section = ({ title, names }) => {
    return (
        <div className="border-[1px] border-asu-maroon shadow-md rounded-xl p-2 m-2">
            <p className="text-2xl underline underline-offset-4 mb-1">{title}</p>
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-2 grid-cols-1">
                {names.map((name) => (
                    <p className="text-lg">{name}</p>
                ))}
            </div>
        </div>
    );
};
