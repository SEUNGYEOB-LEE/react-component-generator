import { LiveProvider, LivePreview as ReactLivePreview, LiveError } from 'react-live';

interface LivePreviewProps {
  code: string;
}

export function LivePreview({ code }: LivePreviewProps) {
  return (
    <div className="preview-panel">
      <div className="panel-header">
        <h3>
          <span className="window-dots">
            <span />
            <span />
            <span />
          </span>
          미리보기
        </h3>
      </div>
      <div className="preview-content">
        <LiveProvider code={code} noInline>
          <div className="preview-render viewfinder">
            <span className="preview-live-tag">Live</span>
            <span className="viewfinder-corner viewfinder-corner--tl" />
            <span className="viewfinder-corner viewfinder-corner--tr" />
            <span className="viewfinder-corner viewfinder-corner--bl" />
            <span className="viewfinder-corner viewfinder-corner--br" />
            <ReactLivePreview />
          </div>
          <LiveError className="preview-error" />
        </LiveProvider>
      </div>
    </div>
  );
}
