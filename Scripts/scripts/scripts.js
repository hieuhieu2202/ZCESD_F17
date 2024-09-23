//$(function () {
//    var esdFaceHub = $.connection.eSDFaceHub;
//    var alertQueue = $('.table-wrapper');   // Phần tử chứa thông báo
//    var currentData = {}; // Đối tượng lưu trữ trạng thái thông báo hiện tại, dùng mã thẻ làm khóa

//    // Hàm ẩn hoặc xóa bảng nếu không còn thông báo
//    function checkAndHideTable() {
//        if (alertQueue.find('tbody tr').length === 0) {
//            alertQueue.hide(); // Ẩn phần tử alertQueue nếu không có dữ liệu
//        }
//    }

//    // Hàm tạo hoặc cập nhật bảng
//    function createTableIfNeeded() {
//        if (alertQueue.find('table').length === 0) {
//            // Tạo bảng mới nếu chưa có
//            alertQueue.append(`
//                <table class="table table-bordered table-hover table-striped text-center custom-table">
//                    <thead class="text-yellow">
//                        <tr>
//                            <th>Mã thẻ<br />卡码</th>
//                            <th>Họ tên<br />姓名</th>
//                            <th>Bộ phận<br />部分</th>
//                            <th>Trạng thái<br />地位</th>
//                            <th>Thời gian<br />时间</th>
//                        </tr>
//                    </thead>
//                    <tbody id="alert-body"></tbody>
//                </table>
//            `);
//        }
//        alertQueue.show(); // Hiển thị bảng
//    }

//    // Hàm cập nhật chiều cao của alertQueue và #alert-body
//    function updateContainerHeight() {
//        var $footer = $('footer');
//        var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
//        var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
//        var windowHeight = $(window).height(); // Chiều cao của cửa sổ

//        // Tính chiều cao của alertQueue để nó không bị đè lên footer
//        var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống để cuộn mượt hơn
//        alertQueue.css('max-height', availableHeight + 'px');
//    }

//    // Hàm cập nhật chiều cao của #alert-body
//    function updateTbodyHeight() {
//        var $thead = alertQueue.find('thead');
//        var theadHeight = $thead.outerHeight(true); // Chiều cao của thead

//        // Cập nhật chiều cao của #alert-body dựa trên chiều cao của alertQueue
//        var tbodyHeight = alertQueue.height() - theadHeight;

//        // Cập nhật chiều cao của #alert-body
//        alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
//    }

//    // Hàm cập nhật thông báo dựa trên dữ liệu mới
//    function updateAlerts(employeeData) {
//        var seenEmployees = new Set(); // Set để theo dõi các mã thẻ đã thấy
//        var hasData = false; // Biến để kiểm tra xem có dữ liệu không
//        var rows = []; // Mảng để lưu trữ hàng dữ liệu
//        var updatedRows = {}; // Đối tượng để lưu trữ các hàng đã cập nhật
//        var $tbody = alertQueue.find('#alert-body'); // Truy vấn tbody một lần

//        // Lặp qua dữ liệu mới để cập nhật thông báo
//        $.each(employeeData, function (index, employee) {
//            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường
//            var employeeTime = moment(employee.ThoiGian).valueOf(); // Chuyển thời gian thành giá trị số để so sánh

//            // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
//            if (errorCode === 'pass') {
//                var $alertItem = currentData[employee.MaThe];
//                if ($alertItem) {
//                    $alertItem.fadeOut(function () {
//                        $alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
//                        delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
//                        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không còn thông báo
//                    });
//                }
//            } else {
//                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
//                hasData = true; // Đặt cờ có dữ liệu
//                var existingAlertItem = currentData[employee.MaThe];
//                if (existingAlertItem) {
//                    // Nếu hàng đã tồn tại và thời gian mới hơn thì cập nhật
//                    var existingTime = moment(existingAlertItem.find('td').eq(4).text(), 'YYYY/MM/DD HH:mm:ss').valueOf();
//                    if (employeeTime > existingTime) {
//                        existingAlertItem.find('td').eq(1).text(employee.HoTen);
//                        existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
//                        existingAlertItem.find('td').eq(3).text(employee.Status);
//                        existingAlertItem.find('td').eq(4).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
//                        updatedRows[employee.MaThe] = existingAlertItem; // Lưu hàng đã cập nhật
//                    }
//                } else {
//                    // Nếu hàng chưa tồn tại thì thêm vào mảng hàng mới
//                    var $newRow = $(
//                        `<tr class="table-danger text-white custom-tbody text-bg-danger">
//                        <td>${employee.MaThe}</td>
//                        <td>${employee.HoTen}</td>
//                        <td>${employee.TenBoPhan}</td>
//                        <td>${employee.Status}</td>
//                        <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
//                    </tr>`
//                    );
//                    rows.push($newRow); // Thêm đối tượng jQuery vào mảng hàng
//                    currentData[employee.MaThe] = $newRow; // Lưu trữ đối tượng jQuery trong currentData
//                }
//            }
//        });

//        // Thêm tất cả các hàng dữ liệu mới vào tbody một lần để tránh cập nhật DOM quá nhiều lần
//        if (rows.length > 0) {
//            $tbody.prepend(rows); // Thêm các hàng dữ liệu mới vào đầu tbody
//        }

//        // Kiểm tra và cập nhật các hàng đã thay đổi
//        $.each(updatedRows, function (key, row) {
//            row.fadeIn(); // Hiển thị các hàng đã được cập nhật
//        });

//        // Tăng kích thước của #alert-body nếu có dữ liệu mới
//        if (rows.length > 0) {
//            var newTbodyHeight = $tbody[0].scrollHeight; // Chiều cao thực tế của tbody sau khi thêm hàng
//            $tbody.css('max-height', newTbodyHeight + 'px');
//        }

//        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không có dữ liệu
//    }


//    // Gọi hàm này khi kích thước cửa sổ thay đổi để cập nhật chiều cao của alertQueue và #alert-body
//    $(window).resize(function () {
//        updateContainerHeight(); // Cập nhật chiều cao của alertQueue khi kích thước cửa sổ thay đổi
//        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body khi kích thước cửa sổ thay đổi
//    });

//    // Nhận dữ liệu mới từ SignalR Hub
//    esdFaceHub.client.updateEmployeeData = function (employeeData) {
//        console.log('Received data:', employeeData); // Ghi log dữ liệu nhận được
//        createTableIfNeeded(); // Tạo bảng nếu chưa có
//        updateAlerts(employeeData); // Cập nhật thông báo với dữ liệu mới
//        updateContainerHeight(); // Cập nhật chiều cao của alertQueue sau khi cập nhật thông báo
//        updateTbodyHeight(); // Cập nhật chiều cao của #alert-body sau khi cập nhật thông báo
//    };

//    // Bắt đầu kết nối với SignalR Hub khi trang được tải xong
//    $.connection.hub.start().done(function () {
//        console.log('SignalR connected.'); // Ghi log khi kết nối thành công

//        // Làm mới dữ liệu mỗi 4 giây
//        setInterval(function () {
//            esdFaceHub.server.getEmployeeData(); // Gọi phương thức của máy chủ để lấy dữ liệu mới
//        }, 4000); // 4000ms = 4 giây
//    });

//    // Cập nhật chiều cao của alertQueue và #alert-body khi trang được tải
//    updateContainerHeight();
//    updateTbodyHeight();
//});
$(function () {
    var esdFaceHub = $.connection.eSDFaceHub;
    var alertQueue = $('.table-wrapper'); // Element that holds the alerts
    var currentData = {}; // Object to store current alert data keyed by card code

    // Dữ liệu tầng tương ứng với từng xưởng

    var floorData = {
        'F06': ['1F', '2F'],
        'F16': ['3F']
    };
    /*
   // Hàm cập nhật dropdown từ URL
    function updateDropdownFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var workshopFromUrl = urlParams.get('Factory'); // Lấy Factory từ URL
        var floorFromUrl = urlParams.get('Floor'); // Lấy Floor từ URL

        // Cập nhật giá trị dropdown với Factory từ URL
        if (workshopFromUrl) {
            $('#workshop').val(workshopFromUrl); // Cập nhật dropdown với giá trị từ URL
            updateFloors(workshopFromUrl, floorFromUrl); // Cập nhật tầng sau khi xưởng được chọn
        }

        // Cập nhật giá trị dropdown với Floor từ URL
        if (floorFromUrl) {
            $('#floor').val(floorFromUrl); // Cập nhật dropdown với giá trị từ URL
        }

        // Gọi fetchData chỉ khi cả workshop và floor đều có giá trị
        fetchData();
    }

    // Hàm cập nhật tầng
    window.updateFloors = function (workshop, floorFromUrl) {
        var $floorSelect = $('#floor');
        $floorSelect.empty();
        $floorSelect.append('<option value="">Chọn tầng</option>');

        console.log('Selected workshop:', workshop); // Debug
        if (floorData[workshop]) {
            floorData[workshop].forEach(function (floor) {
                $floorSelect.append('<option value="' + floor + '">' + floor + '</option>');
            });
        } else {
            console.log('No floors available for this workshop.'); // Debug
        }

        // Cập nhật lại giá trị floor nếu có từ URL
        if (floorFromUrl) {
            $floorSelect.val(floorFromUrl); // Đặt giá trị cho floor từ URL
        }

        updateUrl($floorSelect.val()); // Cập nhật URL với giá trị floor hiện tại
        fetchData(); // Gọi fetchData sau khi cập nhật tầng
    };

    // Hàm cập nhật URL
    function updateUrl(selectedFloor) {
        var workshop = $('#workshop').val();
        var url = new URL(window.location);
        url.pathname = '/'; // Đặt lại pathname thành gốc
        url.searchParams.set('Factory', workshop); // Thêm tham số Factory
        url.searchParams.set('Floor', selectedFloor); // Cập nhật tham số Floor, nếu không có thì để trống
        history.replaceState(null, '', url); // Thay đổi URL mà không làm mới trang
    }

    // Hàm fetchData
    window.fetchData = function () {
        var workshop = $('#workshop').val();
        var floor = $('#floor').val();
        if (esdFaceHub.connection.state === $.signalR.connectionState.connected) { // Kiểm tra trạng thái kết nối
            if (workshop && floor) {
                esdFaceHub.server.getEmployeeData(workshop, floor); // Gọi phương thức lấy dữ liệu với xưởng và tầng
            }
        } else {
            console.log('SignalR connection not established.');
        }
    };

    // Gán sự kiện change cho #workshop
    $('#workshop').change(function () {
        var workshop = $(this).val();
        updateFloors(workshop); // Cập nhật tầng khi chọn xưởng
    });

    // Gán sự kiện change cho #floor
    $('#floor').change(function () {
        var selectedFloor = $(this).val();
        updateUrl(selectedFloor); // Cập nhật URL khi chọn tầng
        fetchData(); // Gọi hàm fetchData
    });

    // Gọi hàm updateDropdownFromUrl khi trang được tải
    $(document).ready(function () {
        updateDropdownFromUrl(); // Cập nhật dropdown từ URL
    });
    */
    // Hàm cập nhật từ URL
    function updateDropdownFromUrl() {
        var urlParams = new URLSearchParams(window.location.search);
        var workshopFromUrl = urlParams.get('Factory')?.toUpperCase(); // Lấy Factory từ URL
        var floorFromUrl = urlParams.get('Floor')?.toUpperCase(); // Lấy Floor từ URL

        // Kiểm tra xem xưởng có tồn tại trong dữ liệu không
        if (workshopFromUrl && floorData[workshopFromUrl]) {
            // Cập nhật và hiển thị kết quả
            console.log('Selected workshop:', workshopFromUrl);

            // Cập nhật tầng
            updateFloors(workshopFromUrl, floorFromUrl);
        } else {
            console.log('Workshop không hợp lệ hoặc không có dữ liệu.');
        }
    }

    // Hàm cập nhật tầng
    window.updateFloors = function (workshop, floorFromUrl) {
        console.log('Updating floors for workshop:', workshop); // Debug
        if (floorData[workshop]) {
            // Hiển thị tầng hợp lệ
            console.log('Floors available:', floorData[workshop]);

            // Nếu có tầng từ URL, kiểm tra tính hợp lệ
            if (floorFromUrl && floorData[workshop].includes(floorFromUrl)) {
                console.log('Selected floor:', floorFromUrl); // Debug
                fetchData(workshop, floorFromUrl); // Gọi hàm fetchData với thông tin đã chọn
            } else {
                console.log('Floor không hợp lệ hoặc không có dữ liệu.');
            }
        }
    };

    // Hàm fetchData
    window.fetchData = function (workshop, floor) {
        if (esdFaceHub.connection.state === $.signalR.connectionState.connected) { // Kiểm tra trạng thái kết nối
            if (workshop && floor) {
                esdFaceHub.server.getEmployeeData(workshop, floor); // Gọi phương thức lấy dữ liệu với xưởng và tầng
            }
        } else {
            console.log('SignalR connection not established.');
        }
    };

    // Gọi hàm updateDropdownFromUrl khi trang được tải
    $(document).ready(function () {
        updateDropdownFromUrl(); // Cập nhật từ URL

        // Thiết lập tự động cập nhật dữ liệu mỗi 4 giây
        setInterval(function () {
            var urlParams = new URLSearchParams(window.location.search);
            var workshopFromUrl = urlParams.get('Factory');
            var floorFromUrl = urlParams.get('Floor');

            // Gọi lại hàm fetchData để tự động cập nhật
            updateFloors(workshopFromUrl, floorFromUrl);
        }, 4000); // 4000 milliseconds = 4 seconds
    });


    // Hàm kiểm tra và ẩn bảng nếu không có cảnh báo
    function checkAndHideTable() {
        if (alertQueue.find('tbody tr').length === 0) {
            alertQueue.hide(); // Hide alertQueue if there's no data
        }
    }

    // Hàm tạo bảng nếu cần
    function createTableIfNeeded() {
        if (alertQueue.find('table').length === 0) {
            alertQueue.append(`
                <table class="table table-bordered table-hover table-striped text-center custom-table">
                    <thead class="text-yellow">
                        <tr>
                            <th>Mã thẻ<br />卡码</th>
                            <th>Họ tên<br />姓名</th>
                            <th>Bộ phận<br />部分</th>
                            <th>Trạng thái<br />地位</th>
                            <th>Thời gian<br />时间</th>
                        </tr>
                    </thead>
                    <tbody id="alert-body"></tbody>
                </table>
            `);
        }
        alertQueue.show(); // Show the table
    }

    // Hàm cập nhật chiều cao của alertQueue
    function updateContainerHeight() {
        var $footer = $('footer');
        var footerHeight = $footer.outerHeight(true); // Chiều cao của footer
        var containerTop = alertQueue.offset().top; // Vị trí của alertQueue tính từ đầu trang
        var windowHeight = $(window).height(); // Chiều cao của cửa sổ
        var availableHeight = windowHeight - (containerTop + footerHeight + 20); // Cộng thêm 20px khoảng trống
        alertQueue.css('max-height', availableHeight + 'px');
    }

    // Hàm cập nhật chiều cao của #alert-body
    function updateTbodyHeight() {
        var $thead = alertQueue.find('thead');
        var theadHeight = $thead.outerHeight(true);
        var tbodyHeight = alertQueue.height() - theadHeight;
        alertQueue.find('#alert-body').css('max-height', tbodyHeight + 'px');
    }

    // Hàm cập nhật cảnh báo dựa trên dữ liệu mới
    function updateAlerts(employeeData) {
        var hasData = false; // Biến để kiểm tra xem có dữ liệu không
        var rows = []; // Mảng để lưu trữ hàng dữ liệu

        // Lặp qua dữ liệu mới để cập nhật thông báo
        $.each(employeeData, function (index, employee) {
            var errorCode = employee.ErrorCode.toLowerCase(); // Chuyển mã lỗi thành chữ thường
            var employeeTime = moment(employee.ThoiGian).valueOf(); // Chuyển thời gian thành giá trị số để so sánh

            if (errorCode === 'pass') {
                // Nếu trạng thái là pass, xóa thông báo lỗi liên quan
                var $alertItem = currentData[employee.MaThe];
                if ($alertItem) {
                    $alertItem.fadeOut(function () {
                        $alertItem.remove(); // Xóa phần tử thông báo sau khi ẩn
                        delete currentData[employee.MaThe]; // Cập nhật dữ liệu hiện tại
                        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không còn thông báo
                    });
                }
            } else {
                // Nếu trạng thái là fail, kiểm tra và thêm thông báo lỗi mới nếu chưa thấy
                hasData = true; // Đặt cờ có dữ liệu
                var existingAlertItem = currentData[employee.MaThe];

                if (existingAlertItem) {
                    // Nếu hàng đã tồn tại và thời gian mới hơn thì cập nhật
                    var existingTime = moment(existingAlertItem.find('td').eq(4).text(), 'YYYY/MM/DD HH:mm:ss').valueOf();
                    if (employeeTime > existingTime) {
                        existingAlertItem.find('td').eq(1).text(employee.HoTen);
                        existingAlertItem.find('td').eq(2).text(employee.TenBoPhan);
                        existingAlertItem.find('td').eq(3).text(employee.Status);
                        existingAlertItem.find('td').eq(4).text(moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss'));
                        existingAlertItem.fadeIn(); // Hiển thị thông báo đã cập nhật
                    }
                } else {
                    // Nếu hàng chưa tồn tại thì thêm vào mảng hàng mới
                    var $newRow = $(`
                    <tr class="table-danger text-white custom-tbody text-bg-danger">
                        <td>${employee.MaThe}</td>
                        <td>${employee.HoTen}</td>
                        <td>${employee.TenBoPhan}</td>
                        <td>${employee.Status}</td>
                        <td>${moment(employee.ThoiGian).format('YYYY/MM/DD HH:mm:ss')}</td>
                    </tr>
                `);
                    rows.push($newRow); // Thêm đối tượng jQuery vào mảng hàng
                    currentData[employee.MaThe] = $newRow; // Lưu trữ đối tượng jQuery trong currentData
                }
            }
        });

        // Thêm tất cả các hàng dữ liệu vào tbody
        if (rows.length > 0) {
            var $tbody = alertQueue.find('#alert-body');
            $tbody.prepend(rows); // Thêm các hàng dữ liệu vào đầu tbody
        }

        checkAndHideTable(); // Kiểm tra và ẩn bảng nếu không có dữ liệu
    }

    // Cập nhật chiều cao khi resize
    $(window).resize(function () {
        updateContainerHeight();
        updateTbodyHeight();
    });

    // Nhận dữ liệu từ SignalR
    esdFaceHub.client.updateEmployeeData = function (employeeData) {
        console.log('Received data:', employeeData);
        createTableIfNeeded();
        updateAlerts(employeeData);
        updateContainerHeight();
        updateTbodyHeight();
    };

    // Kết nối đến SignalR Hub
    $.connection.hub.start().done(function () {
        console.log('SignalR connected.');
        updateDropdownFromUrl(); // Cập nhật dropdown từ URL khi kết nối
        fetchData(); // Lần đầu tiên lấy dữ liệu ngay khi kết nối
        setInterval(fetchData, 4000); // Gọi hàm fetchData mỗi 4 giây
    }).fail(function () {
        console.error('SignalR connection failed.');
    });

    // Cập nhật chiều cao của container khi tải trang
    updateContainerHeight();
    updateTbodyHeight();
});

