//! Game Planner - Windows UI
//!
//! A native Windows application for planning game build orders and action sequences.
//! Uses Win32 API through the windows crate for a lightweight, native experience.

#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(windows)]
mod windows_ui {
    use gameplanner_core::{BuildOrder, ChessGame, Game, GameItem};
    use std::cell::RefCell;
    use std::rc::Rc;
    use windows::{
        core::*,
        Win32::Foundation::*,
        Win32::Graphics::Gdi::*,
        Win32::System::LibraryLoader::GetModuleHandleW,
        Win32::UI::Controls::*,
        Win32::UI::WindowsAndMessaging::*,
    };

    const WM_CREATE_CONTROLS: u32 = WM_USER + 1;
    const ID_LISTVIEW_ITEMS: i32 = 1001;
    const ID_LISTVIEW_BUILDORDER: i32 = 1002;
    const ID_BUTTON_ADD: i32 = 1003;
    const ID_BUTTON_REMOVE: i32 = 1004;
    const ID_BUTTON_CLEAR: i32 = 1005;
    const ID_STATIC_TITLE: i32 = 1006;
    const ID_STATIC_AVAILABLE: i32 = 1007;
    const ID_STATIC_BUILDORDER: i32 = 1008;

    // Application state
    struct AppState {
        game: Game,
        build_order: BuildOrder,
        hwnd_items_list: HWND,
        hwnd_build_order_list: HWND,
    }

    impl AppState {
        fn new() -> Self {
            Self {
                game: ChessGame::create(),
                build_order: BuildOrder::new("My Build Order"),
                hwnd_items_list: HWND(0),
                hwnd_build_order_list: HWND(0),
            }
        }
    }

    pub unsafe fn run() -> Result<()> {
        let instance = GetModuleHandleW(None)?;
        let class_name = w!("GamePlannerWindow");

        let wc = WNDCLASSW {
            lpfnWndProc: Some(wndproc),
            hInstance: instance.into(),
            lpszClassName: class_name,
            hCursor: LoadCursorW(None, IDC_ARROW)?,
            hbrBackground: HBRUSH((COLOR_WINDOW.0 + 1) as isize),
            ..Default::default()
        };

        RegisterClassW(&wc);

        let hwnd = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            class_name,
            w!("Game Planner - Windows UI"),
            WS_OVERLAPPEDWINDOW | WS_VISIBLE,
            CW_USEDEFAULT,
            CW_USEDEFAULT,
            900,
            600,
            None,
            None,
            instance,
            None,
        )?;

        ShowWindow(hwnd, SW_SHOW);

        let mut message = MSG::default();
        while GetMessageW(&mut message, None, 0, 0).into() {
            TranslateMessage(&message);
            DispatchMessageW(&message);
        }

        Ok(())
    }

    unsafe extern "system" fn wndproc(
        hwnd: HWND,
        msg: u32,
        wparam: WPARAM,
        lparam: LPARAM,
    ) -> LRESULT {
        match msg {
            WM_CREATE => {
                // Initialize app state
                let state = Box::new(RefCell::new(AppState::new()));
                SetWindowLongPtrW(hwnd, GWLP_USERDATA, Box::into_raw(state) as _);
                
                // Post message to create controls after window is fully created
                PostMessageW(hwnd, WM_CREATE_CONTROLS, WPARAM(0), LPARAM(0)).ok();
                LRESULT(0)
            }
            WM_CREATE_CONTROLS => {
                create_controls(hwnd);
                populate_items_list(hwnd);
                LRESULT(0)
            }
            WM_COMMAND => {
                let command_id = LOWORD(wparam.0 as u32) as i32;
                match command_id {
                    ID_BUTTON_ADD => handle_add_item(hwnd),
                    ID_BUTTON_REMOVE => handle_remove_item(hwnd),
                    ID_BUTTON_CLEAR => handle_clear_build_order(hwnd),
                    _ => {}
                }
                LRESULT(0)
            }
            WM_SIZE => {
                resize_controls(hwnd, LOWORD(lparam.0 as u32), HIWORD(lparam.0 as u32));
                LRESULT(0)
            }
            WM_DESTROY => {
                // Clean up app state
                let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
                if state_ptr != 0 {
                    let _ = Box::from_raw(state_ptr as *mut RefCell<AppState>);
                }
                PostQuitMessage(0);
                LRESULT(0)
            }
            _ => DefWindowProcW(hwnd, msg, wparam, lparam),
        }
    }

    unsafe fn create_controls(hwnd: HWND) {
        let instance = GetModuleHandleW(None).unwrap();

        // Title label
        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("STATIC"),
            w!("Chess Game Planner"),
            WS_CHILD | WS_VISIBLE | WINDOW_STYLE(SS_CENTER.0 as u32),
            10,
            10,
            860,
            30,
            hwnd,
            HMENU(ID_STATIC_TITLE as _),
            instance,
            None,
        )
        .ok();

        // Available moves label
        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("STATIC"),
            w!("Available Moves:"),
            WS_CHILD | WS_VISIBLE,
            10,
            50,
            400,
            20,
            hwnd,
            HMENU(ID_STATIC_AVAILABLE as _),
            instance,
            None,
        )
        .ok();

        // Available items list view
        let hwnd_items = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("LISTBOX"),
            PCWSTR::null(),
            WS_CHILD | WS_VISIBLE | WS_BORDER | WS_VSCROLL | WINDOW_STYLE(LBS_NOTIFY as u32),
            10,
            75,
            400,
            400,
            hwnd,
            HMENU(ID_LISTVIEW_ITEMS as _),
            instance,
            None,
        )
        .unwrap();

        // Buttons
        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("BUTTON"),
            w!("Add >>"),
            WS_CHILD | WS_VISIBLE | WINDOW_STYLE(BS_PUSHBUTTON as u32),
            420,
            200,
            60,
            30,
            hwnd,
            HMENU(ID_BUTTON_ADD as _),
            instance,
            None,
        )
        .ok();

        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("BUTTON"),
            w!("<< Remove"),
            WS_CHILD | WS_VISIBLE | WINDOW_STYLE(BS_PUSHBUTTON as u32),
            420,
            240,
            60,
            30,
            hwnd,
            HMENU(ID_BUTTON_REMOVE as _),
            instance,
            None,
        )
        .ok();

        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("BUTTON"),
            w!("Clear All"),
            WS_CHILD | WS_VISIBLE | WINDOW_STYLE(BS_PUSHBUTTON as u32),
            420,
            280,
            60,
            30,
            hwnd,
            HMENU(ID_BUTTON_CLEAR as _),
            instance,
            None,
        )
        .ok();

        // Build order label
        CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("STATIC"),
            w!("Build Order:"),
            WS_CHILD | WS_VISIBLE,
            490,
            50,
            390,
            20,
            hwnd,
            HMENU(ID_STATIC_BUILDORDER as _),
            instance,
            None,
        )
        .ok();

        // Build order list view
        let hwnd_build_order = CreateWindowExW(
            WINDOW_EX_STYLE::default(),
            w!("LISTBOX"),
            PCWSTR::null(),
            WS_CHILD | WS_VISIBLE | WS_BORDER | WS_VSCROLL | WINDOW_STYLE(LBS_NOTIFY as u32),
            490,
            75,
            390,
            400,
            hwnd,
            HMENU(ID_LISTVIEW_BUILDORDER as _),
            instance,
            None,
        )
        .unwrap();

        // Store control handles in app state
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr != 0 {
            let state = &*(state_ptr as *const RefCell<AppState>);
            let mut state_mut = state.borrow_mut();
            state_mut.hwnd_items_list = hwnd_items;
            state_mut.hwnd_build_order_list = hwnd_build_order;
        }
    }

    unsafe fn populate_items_list(hwnd: HWND) {
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr == 0 {
            return;
        }

        let state = &*(state_ptr as *const RefCell<AppState>);
        let state_ref = state.borrow();

        for item in &state_ref.game.items {
            let display = format!("{} - {}", item.name, item.description);
            let wide: Vec<u16> = display.encode_utf16().chain(Some(0)).collect();
            SendMessageW(
                state_ref.hwnd_items_list,
                LB_ADDSTRING,
                WPARAM(0),
                LPARAM(wide.as_ptr() as _),
            );
        }
    }

    unsafe fn handle_add_item(hwnd: HWND) {
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr == 0 {
            return;
        }

        let state = &*(state_ptr as *const RefCell<AppState>);
        let mut state_mut = state.borrow_mut();

        let selected_index = SendMessageW(
            state_mut.hwnd_items_list,
            LB_GETCURSEL,
            WPARAM(0),
            LPARAM(0),
        )
        .0 as isize;

        if selected_index >= 0 && (selected_index as usize) < state_mut.game.items.len() {
            let item = &state_mut.game.items[selected_index as usize];
            state_mut.build_order.add_step(item);

            let display = format!("{}. {}", state_mut.build_order.steps.len(), item.name);
            let wide: Vec<u16> = display.encode_utf16().chain(Some(0)).collect();
            SendMessageW(
                state_mut.hwnd_build_order_list,
                LB_ADDSTRING,
                WPARAM(0),
                LPARAM(wide.as_ptr() as _),
            );
        }
    }

    unsafe fn handle_remove_item(hwnd: HWND) {
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr == 0 {
            return;
        }

        let state = &*(state_ptr as *const RefCell<AppState>);
        let mut state_mut = state.borrow_mut();

        let selected_index = SendMessageW(
            state_mut.hwnd_build_order_list,
            LB_GETCURSEL,
            WPARAM(0),
            LPARAM(0),
        )
        .0 as isize;

        if selected_index >= 0 && (selected_index as usize) < state_mut.build_order.steps.len() {
            state_mut.build_order.remove_step(selected_index as usize);

            // Refresh the build order list
            SendMessageW(
                state_mut.hwnd_build_order_list,
                LB_RESETCONTENT,
                WPARAM(0),
                LPARAM(0),
            );

            for (i, step) in state_mut.build_order.steps.iter().enumerate() {
                let display = format!("{}. {}", i + 1, step.item.name);
                let wide: Vec<u16> = display.encode_utf16().chain(Some(0)).collect();
                SendMessageW(
                    state_mut.hwnd_build_order_list,
                    LB_ADDSTRING,
                    WPARAM(0),
                    LPARAM(wide.as_ptr() as _),
                );
            }
        }
    }

    unsafe fn handle_clear_build_order(hwnd: HWND) {
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr == 0 {
            return;
        }

        let state = &*(state_ptr as *const RefCell<AppState>);
        let mut state_mut = state.borrow_mut();

        state_mut.build_order.clear();
        SendMessageW(
            state_mut.hwnd_build_order_list,
            LB_RESETCONTENT,
            WPARAM(0),
            LPARAM(0),
        );
    }

    unsafe fn resize_controls(hwnd: HWND, width: u16, height: u16) {
        let state_ptr = GetWindowLongPtrW(hwnd, GWLP_USERDATA);
        if state_ptr == 0 {
            return;
        }

        let state = &*(state_ptr as *const RefCell<AppState>);
        let state_ref = state.borrow();

        let w = width as i32;
        let h = height as i32;

        // Resize items list
        SetWindowPos(
            state_ref.hwnd_items_list,
            None,
            10,
            75,
            (w - 520).max(300),
            (h - 115).max(200),
            SWP_NOZORDER,
        )
        .ok();

        // Resize build order list
        SetWindowPos(
            state_ref.hwnd_build_order_list,
            None,
            (w - 400).max(490),
            75,
            390,
            (h - 115).max(200),
            SWP_NOZORDER,
        )
        .ok();
    }
}

#[cfg(not(windows))]
mod windows_ui {
    pub unsafe fn run() -> Result<(), Box<dyn std::error::Error>> {
        eprintln!("This application is only supported on Windows.");
        eprintln!("Please use the CLI version (gameplanner) on non-Windows platforms.");
        Err("Windows-only application".into())
    }
}

fn main() {
    unsafe {
        if let Err(e) = windows_ui::run() {
            eprintln!("Error: {}", e);
            std::process::exit(1);
        }
    }
}
