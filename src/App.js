import "./App.css";
import Map from "./Map";

function App() {
  return (
    <div className="container mx-auto">
      <header className="flex justify-center items-center mb-10">
        <div className="flex-initial text-center pt-5 title-container">
          <h1>Un café cerca a ti</h1>
        </div>
      </header>
      <main>
        <Map />
      </main>
    </div>
  );
}

export default App;
