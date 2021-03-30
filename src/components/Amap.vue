<template>
    <div class="amap">
        <div class="container" id="container"></div>
    </div>
</template>

<script>
    import AMap from 'AMap'
    import {GetCity, GetPositionByDate, GetUser} from "@/api/apis";

    export default {
        name: "Amap",
        data() {
            return {
                map: Object,
                heatMap:Object,
                infoWindow: Object,
                heatMapData: [],
            }
        },
        components: {},
        mounted() {
            let that = this;
            that.MapInit();
            // that.HeatMapInit()

        },

        methods: {
            MapInit() {
                let that = this;
                // 地图初始化
                that.map = new AMap.Map('container', {
                    zoom: 5,//级别
                    center: [116.397428, 39.90923],//中心点坐标
                });

                that.GetDistrictData();
                that.GetPosition();

            },

            // 获取疫情城市
            GetDistrictData() {
                let that = this;
                GetCity().then(res => {
                    if (res.data.ret === 200) {
                        let citys = res.data.data;
                        for (let i = 0; i < citys.length; i++) {
                            that.DistrictInit(citys[i].locationId);
                        }
                    }
                })

            },

            DistrictInit(adcode) {
                let that = this;
                // 加载行政区划插件
                AMap.service('AMap.DistrictSearch', function () {
                    let opts = {
                        subdistrict: 1,   // 返回下一级行政区
                        extensions: 'all',  // 返回行政区边界坐标组等具体信息
                        level: 'city'  // 查询行政级别为市
                    };
                    // 实例化DistrictSearch
                    let district = new AMap.DistrictSearch(opts);

                    district.setLevel('district');

                    // 行政区查询
                    district.search(`${adcode}`, function (status, result) {
                        // console.log(result);
                        // 获取边界信息
                        let bounds = result.districtList[0].boundaries;
                        // 存放行政区划
                        let polygons = [];
                        if (bounds) {
                            for (let i = 0, l = bounds.length; i < l; i++) {
                                let polygon = new AMap.Polygon({
                                    map: that.map,
                                    strokeWeight: 1,
                                    path: bounds[i],
                                    fillOpacity: 0.2,
                                    fillColor: 'rgba(71,228,194,0.44)',
                                    strokeColor: 'rgba(83,204,79,0.65)'
                                });
                                polygons.push(polygon);
                            }
                        }
                    });
                });
            },

            // 添加标记点
            GetPosition() {
                let that = this;
                that.infoWindow = new AMap.InfoWindow({offset: new AMap.Pixel(0, -30)});
                GetPositionByDate({
                    date: new Date().getTime()
                }).then(res => {
                    let positions = res.data.data;
                    for (let i = 0; i < positions.length; i++) {
                        // 将创建的点标记添加到已有的地图实例：
                        let x = positions[i].locationX;
                        let y = positions[i].locationY;

                        //点标记
                        let marker = new AMap.Marker({
                            position: new AMap.LngLat(x, y),   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                        });
                        marker.content = positions[i].userId;
                        marker.on('click', that.markerClick);
                        marker.emit('click', {target: marker});
                        that.map.add(marker);

                        // 添加热力图数据
                        let heatmap = {lng:Number(x),lat:Number(y),count:1};
                        that.heatMapData[i]=heatmap;
                    }
                })
            },

            markerClick(e) {
                let that = this;
                var collegeStr, gradeStr, uidStr;
                GetUser({userId: e.target.content}).then(res => {
                    if (res.data.ret === 200) {
                        collegeStr = "<p>学院:" + res.data.data.college + "</p>";
                        gradeStr = "<p>班级:" + res.data.data.grade + "</p>";
                        uidStr = "<p>学号:" + res.data.data.uid + "</p>";

                        let content = collegeStr + gradeStr + uidStr;
                        // console.log(content)
                        that.infoWindow.setContent(content);
                        that.infoWindow.open(that.map, e.target.getPosition());
                    }
                });
            },


            //判断浏览区是否支持canvas
            isSupportCanvas() {
                var elem = document.createElement('canvas');
                return !!(elem.getContext && elem.getContext('2d'));
            },

            HeatMapInit() {
                let that = this;
                if (!that.isSupportCanvas){
                    alert('热力图仅对支持canvas的浏览器适用,您所使用的浏览器不能使用热力图功能,请换个浏览器试试~')
                    return
                }
                // 加载热力图
                that.map.plugin(["AMap.Heatmap"], function () {
                    //初始化heatmap对象
                    let heatmap = new AMap.Heatmap(that.map, {
                        radius: 25, //给定半径
                        opacity: [0, 0.8]
                        /*,
                        gradient:{
                            0.5: 'blue',
                            0.65: 'rgb(117,211,248)',
                            0.7: 'rgb(0, 255, 0)',
                            0.9: '#ffea00',
                            1.0: 'red'
                        }
                         */
                    });
                    //设置数据集
                    heatmap.setDataSet({
                        data: that.heatMapData,
                    });
                    that.heatMap = heatmap
                });
            },
        },
    }


</script>

<style scoped>
    #container {
        width: 800px;
        height: 800px;
    }

</style>