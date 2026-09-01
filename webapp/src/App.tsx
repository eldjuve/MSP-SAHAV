import { Switch, Match } from 'solid-js';
import { TopBar } from './components/TopBar';
import { Navbar } from './components/Navbar';
import { MapContainer } from './components/MapContainer';
import { MapWidget } from './components/MapWidget';
import { LayersPanel } from './components/LayersPanel';
import { LegendPanel } from './components/LegendPanel';
import { BasemapsPanel } from './components/BasemapsPanel';
import { InfoSidebar } from './components/InfoSidebar';
import { activePanel, sidebarOpen } from './stores/uiStore';

export function App() {
  return (
    <div class="h-full flex flex-col">
      <TopBar />
      <Navbar />
      <div class="relative flex-1 min-h-0 overflow-hidden">
        {/* Cedes width to InfoSidebar when open, md+ only — on narrow
            screens the sidebar overlays full-width instead. */}
        <div
          class="absolute inset-y-0 left-0 right-0 overflow-hidden transition-[right] duration-500"
          classList={{ 'md:right-[40vw]': sidebarOpen() }}
        >
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
        </div>
        <InfoSidebar />
      </div>
    </div>
  );
}
