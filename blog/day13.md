# Day13

目前做到這邊的大家應該會發現一些問題，
在上一個章節，雖然我們成功產生了很多敵人，但是程式卻發生了 Crash。

這就是這個章節的主題，`程式優化`。
卡比將介紹如何找到真正的問題，並採取對應的優化方式。

## Profiling

首先，我們要打開 `DevTool`，並切到 `Memory` 頁籤。

![](./day13/profile_memory.png)

這邊有三個選項，這次只會用到 `Allocation instrumentation on timeline`，他會做一個時間軸並記錄時間內的記憶體使用狀況。

#### 關於兔兔們：

- [Tailwind CSS 臺灣官網](https://tailwindcss.tw)
- [Tailwind CSS 臺灣](https://www.facebook.com/tailwindcss.tw) (臉書粉絲專頁)
- [兔兔教大本營](https://www.facebook.com/lalarabbits-%E5%85%94%E5%85%94%E6%95%99%E5%A4%A7%E6%9C%AC%E7%87%9F-102150975410839/)

![](https://i.imgur.com/PwE2UE9.jpg)
