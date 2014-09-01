< !DOCTYPE html >
    < html lang = "en"
ng - app = "bldr" >

< head >
    < meta charset = "utf-8" >
    < meta http - equiv = "X-UA-Compatible"
content = "IE=edge" >
    < meta name = "viewport"
content = "width=device-width, initial-scale=1" >
    < title > Bootstrap 101 Template < /title>

    <!-- Bootstrap -->
    <link href="public/libs / bootstrap / dist / css / bootstrap.min.css " rel="
stylesheet ">
    <link href="
public / css / style.css " rel="
stylesheet ">

    <!--Angular-->
    <script src="
public / libs / angular / angular.min.js "></script>
    <!--Angular Maps-->
    <script src="
https: //maps.googleapis.com/maps/api/js?v=3.exp&libraries=drawing"></script>
< script src = "public/libs/lodash/dist/lodash.underscore.min.js" > < /script>
    <script src="public/libs / angular - google - maps / dist / angular - google - maps.min.js "></script>
    <!--Angular App Files-->
    <script src="
public / js / app.js "></script>


</head>

<body ng-controller="
bldrController ">
    <div class="
container - fluid ">
        <div class="
row ">
            <div class="
col - md - 6 ">
                <div class="
building - info panel panel -
default ">
                    <div class="
panel - heading ">
                        <h3 class="
panel - title ">Building Info</h3>
                    </div>
                    <div class="
panel - body ">
                        <form class="
form - horizontal " role="
form ">
                            <div class="
form - group ">
                                <label class="
col - sm - 3 control - label ">Building Name</label>
                                <div class="
col - sm - 9 ">
                                    <input type="
text " class="
form - control " ng-model="
buildingName ">
                                </div>
                            </div>
                            <div class="
form - group ">
                                <label class="
col - sm - 3 control - label ">Address</label>
                                <div class="
col - sm - 9 ">
                                    <input type="
text " class="
form - control ">
                                </div>
                            </div>
                            <div class="
form - group ">
                                <label class="
col - sm - 3 control - label ">Building Height</label>
                                <div class="
col - sm - 9 ">
                                    <div class="
input - group ">
                                        <input type="
number " min="
0 " step="
0.1 " class="
form - control ">
                                        <span class="
input - group - addon ">m</span>
                                    </div>
                                </div>

                            </div>
                        </form>
                    </div>
                    <div class="
panel - footer ">
                        <button class="
btn btn - success ">Add Building</button>
                    </div>
                </div>
            </div>
            <div class="
col - md - 6 half ">
                <div class="
panel panel -
default ">
                    <div class="
panel - heading ">
                        <h3 class="
panel - title ">Map</h3>
                    </div>
                    <div class="
panel - body ">
                        <google-map center="
map.center " zoom="
map.zoom " draggable="
true " options="
options " bounds="
map.bounds ">


                        </google-map>
                    </div>
                </div>
            </div>
        </div>
        <div class="
row ">
            <div class="
col - md - 6 ">
                <div class="
panel panel -
default ">
                    <div class="
panel - heading ">
                        <h3 class="
panel - title ">Building List</h3>
                    </div>
                    <div class="
panel - body ">
                        Panel content
                    </div>
                </div>
            </div>
            <div class="
col - md - 6 ">
                <div class="
panel panel -
default ">
                    <div class="
panel - heading ">
                        <h3 class="
panel - title ">3D View</h3>
                    </div>
                    <div class="
panel - body ">
                        Panel content
                    </div>
                </div>
            </div>
        </div>
    </div>



    <!--Javascript-->
    <script src="
https: //ajax.googleapis.com/ajax/libs/jquery/1.11.1/jquery.min.js"></script>
< script src = "public/libs/bootstrap/dist/js/bootstrap.min.js" > < /script>
</body >

< /html>
