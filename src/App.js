import DataSheets from "./pages/DataSheets";
import CollectData from "./pages/CollectData";

function App() {
  return (
    <div className="font-openSans overflow-hidden absolute flex flex-col items-center text-center pt-5 pb-5 justify-center inset-0 bg-gradient-to-tr from-asu-maroon to-asu-gold">
      {/* <DataSheets /> */}
      <CollectData />
    </div>
  );
}

export default App;
