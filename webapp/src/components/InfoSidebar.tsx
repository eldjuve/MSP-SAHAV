import { For, Show } from 'solid-js';
import { sidebarOpen, setSidebarOpen, mainContent, chartReportOptions, selectedChartIndex, setSelectedChartIndex } from '../stores/uiStore';
import { ChartContainer } from './ChartContainer';

export function InfoSidebar() {
  const reports = () => chartReportOptions();
  const selectedReport = () => reports()[Math.min(selectedChartIndex(), reports().length - 1)];

  return (
    <div
      class="absolute inset-y-0 right-0 w-[40vw] max-md:w-full bg-[#f3f3f3] shadow-[-2px_0_5px_rgba(0,0,0,0.2)] transition-transform duration-500"
      style={{ transform: sidebarOpen() ? 'translateX(0)' : 'translateX(100%)' }}
    >
      {/* Handle tab */}
      <button
        class="absolute top-1/2 -translate-y-1/2 -left-10 w-10 py-3.5 bg-blue-600 text-white flex items-center justify-center rounded-l cursor-pointer font-bold text-base"
        onClick={() => setSidebarOpen(o => !o)}
        aria-label="Toggle info panel"
      >
        <Show
          when={sidebarOpen()}
          fallback={<span class="text-center leading-tight text-xs">I<br/>N<br/>F<br/>O</span>}
        >
          <i class="fas fa-angle-right text-xl" />
        </Show>
      </button>

      {/* Content */}
      <div class="h-full overflow-x-hidden overflow-y-auto bg-[#f3f3f3]">
        <div class="px-[3vw] py-[3vh]">
          <div class="flex justify-between items-center bg-gray-100">
            <p class="font-bold text-[1.1rem] py-1 flex-1">
              {mainContent()?.chapterHeader || mainContent()?.title}
            </p>
            <button
              class="border-none bg-none text-xl cursor-pointer text-gray-700 hover:text-red-500 px-2.5"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>
          <hr class="my-2" />
          <Show when={mainContent()}>
            {main => (
              <div class="text-xs text-justify leading-relaxed">
                <Show when={main().subpara}>
                  <p class="mb-2" innerHTML={main().subpara} />
                </Show>
                <Show when={main().about}>
                  <p class="mb-4" innerHTML={main().about} />
                </Show>
              </div>
            )}
          </Show>

          <Show when={reports().length > 1}>
            <select
              class="mb-3 w-full text-xs border border-gray-300 rounded px-2 py-1.5 bg-white"
              value={selectedChartIndex()}
              onChange={e => setSelectedChartIndex(Number(e.currentTarget.value))}
            >
              <For each={reports()}>
                {(option, i) => <option value={i()}>{option.title}</option>}
              </For>
            </select>
          </Show>

          <Show when={selectedReport()}>
            {r => (
              <div class="text-xs text-justify leading-relaxed">
                <Show when={r().chapterHeader && r().chapterHeader !== mainContent()?.chapterHeader}>
                  <p class="font-semibold text-sm mb-2">{r().chapterHeader}</p>
                </Show>
                <Show when={r().subpara}>
                  <p class="mb-2" innerHTML={r().subpara} />
                </Show>
                <Show when={r().about}>
                  <p class="mb-4" innerHTML={r().about} />
                </Show>
                <Show when={r().chartOptions?.length}>
                  <For each={r().chartOptions}>
                    {option => (
                      <div class="mb-4">
                        <ChartContainer option={option} />
                      </div>
                    )}
                  </For>
                </Show>
              </div>
            )}
          </Show>
        </div>
      </div>
    </div>
  );
}
