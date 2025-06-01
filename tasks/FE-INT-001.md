# FE-INT-001: Integrate Modules with Content APIs

## 📋 Task Overview

**Task ID**: FE-INT-001
**Title**: Integrate Modules with Content APIs
**Priority**: 🟡 High
**Status**: 📋 Not Started
**Assignee**: Developer
**Due Date**: January 23, 2025
**Estimated Hours**: 2-3 hours

## 🎯 Objective

Connect the frontend module system with the unified Content API to display real content (videos, labs, games) within each module. This replaces the static data approach with dynamic content loading from the server.

## 🔧 Implementation Requirements

### 1. Update Module Components

Replace static content with API-driven content loading:

```typescript
// frontend/src/components/course/ModuleCard.tsx
import { useGetContentByModuleQuery } from "@/features/api/contentApi";

interface ModuleCardProps {
  module: Module;
  onEnroll?: (moduleId: string) => void;
}

const ModuleCard: React.FC<ModuleCardProps> = ({ module, onEnroll }) => {
  const {
    data: contentData,
    isLoading,
    error,
  } = useGetContentByModuleQuery(module.id);

  const content = contentData?.data || [];
  const videoCount = content.filter((item) => item.type === "video").length;
  const labCount = content.filter((item) => item.type === "lab").length;
  const gameCount = content.filter((item) => item.type === "game").length;

  if (isLoading) {
    return (
      <div className="animate-pulse">
        <div className="h-48 bg-slate-700 rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 border border-green-500/30 rounded-lg p-6">
      <h3 className="text-xl font-bold text-green-400 mb-2">{module.title}</h3>
      <p className="text-gray-300 mb-4">{module.description}</p>

      {/* Real Content Statistics */}
      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Videos:</span>
          <span className="text-green-400">{videoCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Labs:</span>
          <span className="text-yellow-400">{labCount}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Games:</span>
          <span className="text-purple-400">{gameCount}</span>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <span className="text-gray-400">Total:</span>
          <span className="text-white">{content.length}</span>
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm mb-4">Failed to load content</div>
      )}

      <button
        onClick={() => onEnroll?.(module.id)}
        className="w-full bg-green-600 hover:bg-green-500 text-white py-2 px-4 rounded transition-colors"
      >
        Start Learning
      </button>
    </div>
  );
};
```

### 2. Create Content API Integration

```typescript
// frontend/src/features/api/contentApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface Content {
  id: string;
  moduleId: string;
  type: "video" | "lab" | "game";
  title: string;
  description: string;
  url?: string;
  instructions?: string;
  order: number;
  duration?: number;
  metadata: Record<string, any>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ContentResponse {
  success: boolean;
  message: string;
  data: Content[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const contentApi = createApi({
  reducerPath: "contentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/content",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Content"],
  endpoints: (builder) => ({
    getAllContent: builder.query<
      ContentResponse,
      {
        type?: string;
        moduleId?: string;
        limit?: number;
        page?: number;
      }
    >({
      query: (params) => ({
        url: "",
        params,
      }),
      providesTags: ["Content"],
    }),
    getContentById: builder.query<{ success: boolean; data: Content }, string>({
      query: (id) => `/${id}`,
      providesTags: (result, error, id) => [{ type: "Content", id }],
    }),
    getContentByModule: builder.query<ContentResponse, string>({
      query: (moduleId) => `/module/${moduleId}`,
      providesTags: (result, error, moduleId) => [
        { type: "Content", id: `module-${moduleId}` },
      ],
    }),
    getContentByType: builder.query<
      ContentResponse,
      {
        type: "video" | "lab" | "game";
        moduleId?: string;
      }
    >({
      query: ({ type, moduleId }) => ({
        url: `/type/${type}`,
        params: moduleId ? { moduleId } : {},
      }),
      providesTags: (result, error, { type }) => [
        { type: "Content", id: `type-${type}` },
      ],
    }),
  }),
});

export const {
  useGetAllContentQuery,
  useGetContentByIdQuery,
  useGetContentByModuleQuery,
  useGetContentByTypeQuery,
} = contentApi;
```

### 3. Update Learning Interface

```typescript
// frontend/src/pages/EnrolledCoursePage.tsx
import { useGetContentByModuleQuery } from "@/features/api/contentApi";

const EnrolledCoursePage: React.FC = () => {
  const { moduleId } = useParams<{ moduleId: string }>();
  const {
    data: contentData,
    isLoading: contentLoading,
    error: contentError,
  } = useGetContentByModuleQuery(moduleId!);

  const content = contentData?.data || [];
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);

  // Auto-select first content item
  useEffect(() => {
    if (content.length > 0 && !selectedContent) {
      setSelectedContent(content[0]);
    }
  }, [content, selectedContent]);

  if (contentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-green-400">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 flex">
      {/* Content Sidebar */}
      <div className="w-80 bg-slate-800 border-r border-green-500/30 p-4">
        <h3 className="text-lg font-bold text-green-400 mb-4">
          Course Content
        </h3>

        {contentError && (
          <div className="text-red-400 text-sm mb-4">
            Failed to load content
          </div>
        )}

        <div className="space-y-2">
          {content.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedContent(item)}
              className={`p-3 rounded cursor-pointer transition-all ${
                selectedContent?.id === item.id
                  ? "bg-green-600 text-white"
                  : "bg-slate-700 text-gray-300 hover:bg-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                {item.type === "video" && <span>📹</span>}
                {item.type === "lab" && <span>🧪</span>}
                {item.type === "game" && <span>🎮</span>}
                <span className="text-sm font-medium">{item.title}</span>
              </div>
              {item.duration && (
                <div className="text-xs text-gray-400 mt-1">
                  {item.duration} minutes
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6">
        {selectedContent ? (
          <ContentViewer content={selectedContent} />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-400">
              <h3 className="text-xl mb-2">Select content to start learning</h3>
              <p>Choose from videos, labs, or games in the sidebar</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
```

### 4. Create Content Viewer Component

```typescript
// frontend/src/components/enrolled/ContentViewer.tsx
interface ContentViewerProps {
  content: Content;
}

const ContentViewer: React.FC<ContentViewerProps> = ({ content }) => {
  const renderContent = () => {
    switch (content.type) {
      case "video":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-green-400">
              {content.title}
            </h2>
            <p className="text-gray-300">{content.description}</p>

            {content.url ? (
              <div className="aspect-video bg-black rounded-lg overflow-hidden">
                <iframe
                  src={content.url}
                  className="w-full h-full"
                  allowFullScreen
                  title={content.title}
                />
              </div>
            ) : (
              <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">Video URL not available</span>
              </div>
            )}
          </div>
        );

      case "lab":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-yellow-400">
              {content.title}
            </h2>
            <p className="text-gray-300">{content.description}</p>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">
                Lab Instructions
              </h3>
              <div className="text-gray-300 whitespace-pre-wrap">
                {content.instructions}
              </div>
            </div>
          </div>
        );

      case "game":
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-purple-400">
              {content.title}
            </h2>
            <p className="text-gray-300">{content.description}</p>

            <div className="bg-slate-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-purple-400 mb-3">
                Game Instructions
              </h3>
              <div className="text-gray-300 whitespace-pre-wrap">
                {content.instructions}
              </div>

              <button className="mt-4 bg-purple-600 hover:bg-purple-500 text-white py-2 px-4 rounded transition-colors">
                Start Game
              </button>
            </div>
          </div>
        );

      default:
        return <div>Unsupported content type</div>;
    }
  };

  return <div className="max-w-4xl mx-auto">{renderContent()}</div>;
};
```

### 5. Update Store Configuration

```typescript
// frontend/src/app/store.ts
import { contentApi } from "@/features/api/contentApi";

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    // Add content API
    [contentApi.reducerPath]: contentApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    })
      .concat(authApi.middleware)
      .concat(contentApi.middleware), // Add content API middleware
});
```

## 🧪 Testing Requirements

### Component Tests

```typescript
// frontend/src/components/course/__tests__/ModuleCard.test.tsx
describe("ModuleCard with Content API", () => {
  it("should display content statistics from API", async () => {
    const mockContent = [
      { type: "video", title: "Video 1" },
      { type: "lab", title: "Lab 1" },
      { type: "game", title: "Game 1" },
    ];

    render(<ModuleCard module={mockModule} onEnroll={mockEnroll} />);

    await waitFor(() => {
      expect(screen.getByText("Videos: 1")).toBeInTheDocument();
      expect(screen.getByText("Labs: 1")).toBeInTheDocument();
      expect(screen.getByText("Games: 1")).toBeInTheDocument();
    });
  });

  it("should handle loading state", () => {
    // Mock loading state
    render(<ModuleCard module={mockModule} />);
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("should handle error state", async () => {
    // Mock error state
    render(<ModuleCard module={mockModule} />);
    await waitFor(() => {
      expect(screen.getByText("Failed to load content")).toBeInTheDocument();
    });
  });
});
```

## 🎯 Success Criteria

- [ ] Module components display real content from API
- [ ] Content statistics (video/lab/game counts) accurate
- [ ] Learning interface loads content dynamically
- [ ] Content viewer handles all content types properly
- [ ] Error states handled gracefully
- [ ] Loading states provide good UX
- [ ] API integration fully tested
- [ ] Type safety maintained throughout
- [ ] Performance optimized with proper caching

## 🔗 Dependencies

**Depends on**: API-001 (Content API Endpoints)
**Blocks**: FE-ENH-001 (Enhanced Learning Interface)

## 📖 Notes

- This task replaces the previous separate phase/module integrations
- Uses RTK Query for efficient API state management
- Implements proper error handling and loading states
- Supports all three content types (video, lab, game)
- Maintains cybersecurity theme throughout UI components
- Sets foundation for advanced learning features

**Benefits of Unified Integration**:

- Single API integration point instead of multiple
- Consistent data flow throughout application
- Better error handling and loading states
- Easier to maintain and extend
- More efficient caching and state management
  </rewritten_file>
