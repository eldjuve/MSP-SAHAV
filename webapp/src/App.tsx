import { Switch, Match } from 'solid-js';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { MapContainer } from './components/MapContainer';
import { MapWidget } from './components/MapWidget';
import { LayersPanel } from './components/LayersPanel';
import { LegendPanel } from './components/LegendPanel';
import { BasemapsPanel } from './components/BasemapsPanel';
import { InfoSidebar } from './components/InfoSidebar';
import { activePanel } from './stores/uiStore';

export function App() {
  return (
    <div class="h-full">
      <TopBar />
      <Navbar />
      <div class="relative h-full overflow-hidden">
        <MapContainer />
        <MapWidget />
        <Switch>
          <Match when={activePanel() === 'layers'}>
            <LayersPanel />
          </Match>
          <Match when={activePanel() === 'legend'}>
            <LegendPanel />
          </Match>
          <Match when={activePanel() === 'basemaps'}>
            <BasemapsPanel />
          </Match>
        </Switch>
        <InfoSidebar />
      </div>
    </div>
  );
}
