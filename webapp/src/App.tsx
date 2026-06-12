import { Show } from 'solid-js';
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
        <Show when={activePanel() === 'layers'}>
          <LayersPanel />
        </Show>
        <Show when={activePanel() === 'legend'}>
          <LegendPanel />
        </Show>
        <Show when={activePanel() === 'basemaps'}>
          <BasemapsPanel />
        </Show>
        <InfoSidebar />
      </div>
    </div>
  );
}
