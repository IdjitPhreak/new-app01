/*jshint devel: true, browser: true, jquery: true, strict: true */
/*global App: false */
var dbz;
var dbx;
var dby;
App.Main = (function() {
	'use strict';
	// Application Constructor
	function Main() {
		console.log("debug: App constructor called");
		bindEvents();
	}

	/*
	 * Bind any events that are required on startup. Common events: 'load',
	 * 'deviceready', 'offline', and 'online'.
	 */
	var bindEvents = function() {
		console.log("debug: App bindEvents called");
		document.addEventListener('deviceready', onDeviceReady, false);
	};

	// Called when device is fully initialized
	var onDeviceReady = function() {
		console.log("debug: App onDeviceReady called");
		showProgramState();
		showDate();
		if (!window.openDatabase) {
			alert('Databases are not supported in this browser.');
			return;
		} else{
			var db = window.openDatabase("Client", "1.0", "FGI",
					1000000);
			db.transaction(populateDB, errorCB, successCB);
			var dbBuilding = window.openDatabase("BuildingInformation",
					"1.0", "FGI", 1000000);
			dbBuilding.transaction(populateDBBuilding, errorCB,
					successCB);
			var dbRooms = window.openDatabase("ROOM", "1.0", "FGI",
					1000000);
			dbRooms.transaction(populateDBRooms, errorCB, successCB);
			console.log("DB's are available");
			dbz = db;
			dbx = dbBuilding;
			dby = dbRooms;
			
		}
	};

	function populateDBRooms(tx) {
		tx.executeSql('DROP TABLE IF EXISTS ROOM');
		tx
				.executeSql(// move room count into Building
						'CREATE TABLE IF NOT EXISTS ROOM( RoomID INTEGER NOT NULL, SpaceID  TEXT NOT NULL, SpaceLength INTEGER NOT NULL, SpaceSquareFootage INTEGER NOT NULL, SpaceWidth INTEGER NOT NULL, SpaceHeight INTEGER NOT NULL, InteriorTF TEXT NOT NULL, RoomMainPurpose TEXT NOT NULL, NumberofLightSwitches INTEGER NOT NULL, NaturalLighting TEXT NOT NULL)',
						[], nullHandler, errorHandler);
		console.log("Table 'ROOM' has been created.");
	}
	;
	
	var populateDBBuilding = function(tx) {
		tx
				.executeSql('DROP TABLE IF EXISTS BuildingInformation');
		tx
				.executeSql(
						'CREATE TABLE IF NOT EXISTS BuildingInformation(RoomCount INTEGER NOT NULL, BuildingBuiltYear INTEGER NOT NULL, AgeOfLighting INTEGER NOT NULL, EnergyBudget INTEGER NOT NULL, EpactTaxDeductionTF TEXT NOT NULL, LightingControlSystemTF TEXT NOT NULL, NameOfDecisionMaker TEXT NOT NULL, EmailOfDecisionMaker TEXT NOT NULL, InstallationRequiredTF INTEGER NOT NULL, UsingOutsideContractorTF INTEGER NOT NULL)',
						[], nullHandler, errorHandler);
		console
				.log("Table 'BuildingInformation' has been created.");
	
	}
	;
	function nullHandler() {
	}
	;
	function errorHandler(transaction, error) {
		alert('Error: ' + error.message + ' code: '
				+ error.code);
	}
	;
	var populateDB = function(tx) {
		tx.executeSql('DROP TABLE IF EXISTS Client');
		tx
				.executeSql(
						'CREATE TABLE IF NOT EXISTS Client(id INTEGER NOT NULL PRIMARY KEY, LegalBusinessName TEXT NOT NULL, ContactName TEXT NOT NULL, ContactTitle TEXT NOT NULL, ContactEmail TEXT NOT NULL, ContactPhone INTEGER NOT NULL,HoursOperationOpenMF INTEGER NOT NULL, HoursOperationCloseMF INTEGER NOT NULL, HoursOperationOpenSat INTEGER NOT NULL, HoursOperationCloseSat INTEGER NOT NULL,HoursOperationOpenSun INTEGER NOT NULL, HoursOperationCloseSun INTEGER NOT NULL,  FacilityType TEXT NOT NULL, EPACT TEXT NOT NULL, HVACFuelType TEXT NOT NULL, UtilityCompany TEXT NOT NULL, MeterNumber INTEGER NOT NULL, AccountNumber INTEGER NOT NULL);',
						[], nullHandler, errorHandler);
		console.log("Table 'Client' has been created.");
	}
	;

	var errorCB = function(err) {
		alert("Error processing SQL: " + err.code);
	}
	;

	var successCB = function() {
		//alert("success!");
	}
	;

	var showProgramState = function() {
		var listeningElement = $('.listening');
		var receivedElement = $('.received');
		listeningElement.attr('style', 'display:none;');
		receivedElement.attr('style', 'display:block;');
	};

	var showDate = function() {
		console.log('debug: showDate called');
		var util = new App.Utility();
		$("#curDate").html("Current Date: " + util.getToday());
	};
	return Main;
})();

$(document)
		.ready(
				function() {
					"use strict";
					new App.Main();
					$("#startBtn").hide();
					$('#safetyForm')
					.change(
							function() {
								console.log('debug: clickEvent called');

								var i = 1;
								var tempVar = 0;
								for (i; i <= 6; i++) {
									if (document
											.getElementById("chkBox-0"
													+ i).checked == true)
										// if (set==true)
										tempVar++;

									else
										tempVar--;

									if (tempVar == 6) {
										$("#startBtn").show();
									} else
										$("#startBtn").hide();
								}

							});
               function getData() {
               return {
               '1st Floor': {
               color: 'blue',
               points: [366, 298, 500, 284, 499, 204, 352, 183, 72, 228, 74, 274]
               },
               '2nd Floor': {
               color: 'red',
               points: [72, 228, 73, 193, 340, 96, 498, 154, 498, 191, 341, 171]
               },
               '3rd Floor': {
               color: 'yellow',
               points: [73, 192, 73, 160, 340, 23, 500, 109, 499, 139, 342, 93]
               },
               'Gym': {
               color: 'green',
               points: [498, 283, 503, 146, 560, 136, 576, 144, 576, 278, 500, 283]
               }
               }
               }
               function updateTooltip(tooltip, x, y, text) {
               tooltip.getText().text(text);
               tooltip.position({x:x, y:y});
               tooltip.show();
               }
               var stage = new Kinetic.Stage({
                                             container: 'container',
                                             width: 578,
                                             height: 325
                                             });
               var shapesLayer = new Kinetic.Layer();
               var tooltipLayer = new Kinetic.Layer();
               
               var tooltip = new Kinetic.Label({
                                               opacity: 0.75,
                                               visible: false,
                                               listening: false
                                               });
               
               tooltip.add(new Kinetic.Tag({
                                           fill: 'black',
                                           pointerDirection: 'down',
                                           pointerWidth: 10,
                                           pointerHeight: 10,
                                           lineJoin: 'round',
                                           shadowColor: 'black',
                                           shadowBlur: 10,
                                           shadowOffset: {x:10,y:10},
                                           shadowOpacity: 0.5
                                           }));
               
               tooltip.add(new Kinetic.Text({
                                            text: '',
                                            fontFamily: 'Calibri',
                                            fontSize: 18,
                                            padding: 5,
                                            fill: 'white'
                                            }));
               
               tooltipLayer.add(tooltip);
               
               // get areas data
               var areas = getData();
               
               // draw areas
               for(var key in areas) {
               
               var area = areas[key];
               var points = area.points;
               
               var shape = new Kinetic.Line({
                                            points: points,
                                            fill: area.color,
                                            opacity: 0,
                                            // custom attr
                                            key: key,
                                            closed: true
                                            });
               
               shapesLayer.add(shape);
               
               }
               
               stage.add(shapesLayer);
               stage.add(tooltipLayer);
               
               
               stage.on('tap', function(evt) {
                        var shape = evt.targetNode;
                        if (shape) {
                        shape.setOpacity(0.5);
                        shapesLayer.draw();
                        }
                        });
               stage.on('dbltap', function(evt) {
                        var shape = evt.targetNode;
                        if (shape) {
                        shape.opacity(0);
                        shapesLayer.draw();
                        tooltip.hide();
                        tooltipLayer.draw();
                        }
                        });
               stage.on('touchend', function(evt) {
                        var shape = evt.targetNode;
                        if (shape) {
                        var mousePos = stage.getPointerPosition();
                        var x = mousePos.x;
                        var y = mousePos.y - 5;
                        updateTooltip(tooltip, x, y, shape.getAttr('key'));
                        tooltipLayer.batchDraw();
                        }
                        });
               
               
               var myStage = new Kinetic.Stage(myCanvas);
					     /* function writeMessage(messageLayer, message) {
					          var context = messageLayer.getContext();
					          messageLayer.clear();
					          context.font = '18pt Calibri';
					          context.fillStyle = 'black';
					          context.fillText(message, 10, 25);
					        }
					        var stage = new Kinetic.Stage({
					          container: 'container',
					          width: 500,
					          height: 500
					        });
					        var tool = 'draw';
					        var layer = new Kinetic.Layer();
					        //var opLayer = new Kinetic.Layer();
					      //  var messageLayer = new Kinetic.Layer();
					        implement the board to draw on
					        var background = new Kinetic.Rect({
					          x: 0,
					          y: 0,
					          width: 499,
					          height: 499,
					          stroke: 'black',
					          //draggable: true,
					          fill: 'blue',
					          strokeWidth: 4
					        });
               var rectangle = new Kinetic.Rect({
                                           x: 239,
                                           y: 75,
                                           width: 100,
                                           height: 50,
                                           fill: 'green',
                                           stroke: 'black',
                                           strokeWidth: 4
                                           });
               var touchPos = stage.getTouchPosition();
               var x = touchPos.x;
               var y = touchPos.y;
               if(tool == 'draw'){
               rectTemp = new Kinetic.Rect({
                                           x: x-10,
                                           y: y-10,
                                           width: 0,
                                           height: 0,
                                           stroke: 'blue',
                                           draggable: true,
                                           strokeWidth: 4,
                                           name: 'www.google.com'
                                           });

					       *//* var rectTemp = undefined;
					          background.on('touchstart', function() {
					          var touchPos = stage.getTouchPosition();
					          var x = touchPos.x;
					          var y = touchPos.y;
					          if(tool == 'draw'){
					          rectTemp = new Kinetic.Rect({
					            		x: x-10,
					            		y: y-10,
					            		width: 0,
					            		height: 0,
					            		stroke: 'blue',
					            		draggable: true,
					            		strokeWidth: 4,
					            		name: 'www.google.com'
					          	});
					          rectTemp.on('dbltap', function() {
					          writeMessage(messageLayer, 'dbltap');
					          this.remove();
					          layer.draw();
					        });
					          rectTemp.on('touchmove', function() {
					            var touchPos = stage.getTouchPosition();
					            var x = touchPos.x-rectTemp.getPosition().x-10;
					            var y = touchPos.y-rectTemp.getPosition().y-10;
					            if(this.getStroke() != 'black'){
					              this.setSize(x,y);
					              layer.draw();
					              writeMessage(messageLayer, 'x: ' + x + ', y: ' + y);
					            }
					            else {
					              var touchPos = stage.getTouchPosition();
					              var x = touchPos.x-rectTemp.getPosition().x-10;
					              var y = touchPos.y-rectTemp.getPosition().y-10;
					              rectTemp.setSize(x,y);
					              layer.draw();
					              writeMessage(messageLayer, 'x: ' + x + ', y: ' + y);
					            }
					          });
					          rectTemp.on('touchend', function() {
					          	rectTemp.setStroke('black');
					          	layer.draw();
					          	rectTemp = null;
					        	});
					          layer.add(rectTemp);
					          writeMessage(messageLayer, 'x: ' + x + ', y: ' + y);
					          }
					       */ /*  if(tool == 'addImg'){
					            var tooltip = new Kinetic.Label({
					          x: x-10,
					          y: y-10,
					          opacity: 0.75,
					          listening: true,
					          text: {
					            text: 'Light Here',
					            fontFamily: 'Calibri',
					            fontSize: 18,
					            padding: 5,
					            fill: 'white',
					            name: 'http://3.bp.blogspot.com/_IveFNaXc6Mo/SNrVtLMmArI/AAAAAAAADnY/9zADU_229VQ/s400/rothschild-bickers-decorative-lighting.jpg'
					          },
					          rect: {
					            fill: 'black',
					            pointerDirection: 'down',
					            pointerWidth: 10,
					            pointerHeight: 10,
					            lineJoin: 'round',
					            shadowColor: 'black',
					            shadowBlur: 10,
					            shadowOffset: 10,
					            shadowOpacity: 0.5
					          }
					        });
					          tooltip.on('tap', function() {
					            writeMessage(messageLayer, 'tap label');
					            window.location = this.getText().getName();
					          });
					          opLayer.add(tooltip);
					          opLayer.draw();
					          }
					        });
					        background.on('touchmove', function() {
					          var touchPos = stage.getTouchPosition();
					          var x = touchPos.x-rectTemp.getPosition().x-10;
					          var y = touchPos.y-rectTemp.getPosition().y-10;
					          if(tool == 'draw'){
					          rectTemp.setSize(x,y);
					          }
					          if(tool == 'addImg'){
					          tooltip.x = x - 10;
					          tooltip.y = y - 10;
					          }
					          layer.draw();
					          writeMessage(messageLayer, 'x: ' + x + ', y: ' + y);
					        });
					        background.on('touchend', function() {
					          rectTemp.setStroke('black');
					          layer.draw();
					          writeMessage(messageLayer, 'created' + rectTemp.getName());
					          rectTemp = null;
					        });*/
               
               
					        // add the shape to the layer
					        //opLayer.add(background);
					        // add the layer to the stage
					        //stage.add(layer);
					        //stage.add(messageLayer);
					       // stage.add(opLayer);
					        //opLayer.moveToTop();
					        
					        document.getElementById('add_img').addEventListener('click', function() {
					          tool = 'addImg';
					          layer.draw();
					        }, false);
					        document.getElementById('draw').addEventListener('click', function() {
					          tool = 'draw';
					          layer.draw();
					        }, false);
					        document.getElementById('clear').addEventListener('click', function() {
					          layer.removeChildren();
					          tool = 'draw';
					          layer.draw();
					        }, false);
					        document.getElementById('done').addEventListener('click', function() {
					          tool = 'done';
					          layer.draw();
					          var json = stage.toJSON();
					          writeMessage(messageLayer, 'JSON:' + json);
					        }, false);
					        
					//	var ref = window.open('http://www.myeventube.com/assets/assets/test/test3.html', '_self');
					
					//
					  $('input[type=button]').click(function () {
					        $(this).toggleClass('active');
					    });
					
					var utilityTF;
					var jsonTemp;
					var EpactTF;
					var choiceEpactTF;
					var controlSysTF;
					var installTF;
					var contractorTF;
					var str;
					var interiorTF;
					var rowId = 1;
					var roomCount = 1;
					var rowBuildingId = 1;
					var buildingAge = $('#select-choice-month').val() * 100
							+ $('#select-choice-year').val();

					jQuery.validator.setDefaults({
						debug : true
					});

					// Client yes no buttons
					if ($('#utilTrue').click())
						utilityTF = "True";

					if ($('#utilFalse').click())
						utilityTF = "False";

					if ($('#EpactTrue').click())
						EpactTF = "True";

					if ($('#EpactFalse').click())
						EpactTF = "False";

					// Building info Y/N buttons
					if ($('#yesEpact').click())
						choiceEpactTF = "True";

					if ($('#noEpact').click())
						choiceEpactTF = "False";

					if ($('#yesControlSys').click())
						controlSysTF = "True";

					if ($('#noControlSys').click())
						controlSysTF = "False";

					if ($('#installYes').click())
						installTF = "True";

					if ($('#installNo').click())
						installTF = "False";

					if ($('#contractorYes').click())
						contractorTF = "True";

					if ($('#contractorNo').click())
						contractorTF = "False";
					// Room TF buttons
					if ($('#interior').click())
						interiorTF = "True";

					if ($('#exterior').click())
						interiorTF = "False";

					
					var temp;
					$("#validClientNext").click(function(e) {
						$("#clientInfo").validate();
						console.log("client info clicked");
						 
						// e.preventDefault();
						 temp = $("#clientInfo").valid();
						if (temp == true) {
							// showValues(clientInfo);
							AddValueToDB();
							// $('#clientInfo').submit();
						} 
						else {
							alert("Field entry still required!");
							e.preventDefault();
						}
					});
					
					 $("#validBuildingNext").click(function(e) {
						$("#buildingInfoForm").validate();
						console.log("building info clicked");
						
						// e.preventDefault();
						temp = $("#buildingInfoForm")
								.valid();
						if (temp == true) {
							AddBuildingFormValueToDB();
							// $('#buildingInfoForm').submit();
						} else {
							alert("Field entry still required!");
							e.preventDefault();
						}
					});
					
					 $("#addroom").click(function(e) {	
						$("#roomForm").validate();
						console.log("add room clicked");
						
						var temp = $("#roomForm").valid();
						if (temp == true) {
							showValues(buildingInfoForm);
							AddRoomFormValueToDB();
							// $('#roomForm').submit();
							// Clear form and input more data about new room
							$("#roomForm")
									.children(
											'input, select, textarea')
									.val('');
							$("#roomForm")
									.children(
											'input[type=radio], input[type=checkbox]')
									.each(
											function() {
												$(this).checked() = false;
											});
							// if room is same as another include button to
							// duplicate room, apply to list view
							
						} else {
							alert("Field entry still required!");
							e.preventDefault();
						}
					
				});

					
					function ListDBValues() {// client form
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						;
						// content is not just keep repeating lines
						$('#dbTest').html('');
						dbz
								.transaction(
										function(transaction) {
											transaction
													.executeSql(
															'SELECT * FROM Client',
															[],
															function(
																	transaction,
																	result) {
																console
																		.log(result.rows.length);
																if (result != null
																		&& result.rows != null) {
																	for ( var i = 0; i < result.rows.length; i++) {
																		var row = result.rows
																				.item(i);
																		///insert Client global variable
																		  jsonTemp = JSON.stringify(row);
																			console.log(jsonTemp);
																		$(
																				'#dbTest')
																				.append(
																						'<br>'
																								+ rowId
																								+ ' '
																								+ row.LegalBusinessName
																								+ ' '
																								+ row.ContactName
																								+ ' '
																								+ row.ContactTitle
																								+ ' '
																								+ row.ContactEmail
																								+ ' '
																								+ row.ContactPhone
																								+ ' '
																								+ row.HoursOperationOpenMF
																								+ ' '
																								+ row.HoursOperationCloseMF
																								+ ' '
																								+ row.HoursOperationOpenSat
																								+ ' '
																								+ row.HoursOperationCloseSat
																								+ ' '
																								+ row.HoursOperationOpenSun
																								+ ' '
																								+ row.HoursOperationCloseSun
																								+ ' '
																								+ row.FacilityType
																								+ ' '
																								+ row.EPACT
																								+ ' '
																								+ row.HVACFuelType
																								+ ' '
																								+ row.UtilityCompany
																								+ ' '
																								+ row.MeterNumber
																								+ ' '
																								+ row.AccountNumber);
																	}
																}
															}, errorHandler);
										}, errorHandler, nullHandler);
						return;
					}
					;
					function AddValueToDB() { // ClientForm
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						var sqlTest = [ $('#businessName').val(),
								$('#firstName').val(), $('#lastName').val(),
								$('#email').val(), $('#phoneNum').val(),
								$('#mfTimeStart').val(), $('#mfTimeEnd').val(),
								$('#satTimeStart').val(),
								$('#satTimeEnd').val(),
								$('#sunTimeStart').val(),
								$('#sunTimeEnd').val(), $('#facType').val(),
								EpactTF, $('#fuelType').val(), utilityTF,
								$('#meterNumber').val(), $('#acctNumber').val() ];

						dbz
								.transaction(function(transaction) {
									transaction
											.executeSql(
													'INSERT INTO Client(id, LegalBusinessName, ContactName, ContactTitle, ContactEmail, ContactPhone, HoursOperationOpenMF, HoursOperationCloseMF, HoursOperationOpenSat, HoursOperationCloseSat, HoursOperationOpenSun, HoursOperationCloseSun, FacilityType, EPACT, HVACFuelType, UtilityCompany, MeterNumber, AccountNumber) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
													[ rowId, sqlTest[0],
															sqlTest[1],
															sqlTest[2],
															sqlTest[3],
															sqlTest[4],
															sqlTest[5],
															sqlTest[6],
															sqlTest[7],
															sqlTest[8],
															sqlTest[9],
															sqlTest[10],
															sqlTest[11],
															sqlTest[12],
															sqlTest[13],
															sqlTest[14],
															sqlTest[15],
															sqlTest[16] ],
													nullHandler, errorHandler);
									console
											.log("Table 'Client' has inserted information.");
									rowId++;// this right now adds a new row to
											// the database, the error is that I
											// cant append the row with this
											// instruction *may cause confusion
											// for sendoing data to server*
								});
						ListDBValues();
						return false;
					}
					;

					function AddBuildingFormValueToDB() {
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						;
						var sqlTest2 = [ buildingAge, $('#lightAge').val(),
								$('#energyBudget').val(), choiceEpactTF,
								controlSysTF, $('#decisionMakerName').val(),
								$('#decisionMakerEmail').val(), installTF,
								contractorTF ];

						dbx
								.transaction(function(transaction) {
									transaction
											.executeSql(
													'INSERT INTO BuildingInformation(RoomCount, BuildingBuiltYear, AgeOfLighting, EnergyBudget, EpactTaxDeductionTF, LightingControlSystemTF, NameOfDecisionMaker, EmailOfDecisionMaker, InstallationRequiredTF, UsingOutsideContractorTF) VALUES (?,?,?,?,?,?,?,?,?,?)',
													[ roomCount,
															sqlTest2[0],
															sqlTest2[1],
															sqlTest2[2],
															sqlTest2[3],
															sqlTest2[4],
															sqlTest2[5],
															sqlTest2[6],
															sqlTest2[7],
															sqlTest2[8] ],
													nullHandler, errorHandler);
									console
											.log("Table 'BuildingInformation' has inserted information.");
									rowBuildingId++;
								});
						ListBuildingDBValues();
						return false;
					}
					;
					function ListBuildingDBValues() {// Building form
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						// content is not just keep repeating lines
						$('#results').html('');
						dbx
								.transaction(
										function(transaction) {
											transaction
													.executeSql(
															'SELECT * FROM BuildingInformation',
															[],
															function(
																	transaction,
																	result) {
																console
																		.log(result.rows.length);
																if (result != null
																		&& result.rows != null) {
																	for ( var i = 0; i < result.rows.length; i++) {
																		var row = result.rows
																				.item(i);
																		//insert building object within the client object
																		  jsonTemp += JSON.stringify(row);
																			console.log(jsonTemp);
																		$(
																				'#results')
																				.append(
																						'<br>'
																								+ row.RoomCount
																								+ ' '
																								+ row.BuildingBuiltYear
																								+ ' '
																								+ row.AgeOfLighting
																								+ ' '
																								+ row.EnergyBudget
																								+ ' '
																								+ row.EPACTChoice
																								+ ' '
																								+ row.ControlSystem
																								+ ' '
																								+ row.NameOfDecisionMaker
																								+ ' '
																								+ row.EmailOfDecisionMaker
																								+ ' '
																								+ row.InstallationRequiredTF
																								+ ' '
																								+ row.UsingOutsideContractorTF);
																	}
																}
															}, errorHandler);
										}, errorHandler, nullHandler);
						return;
					}
					;
					// Room DB data
					// entry!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
					function AddRoomFormValueToDB() {
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}

						var roomID;
						// var photo;
						var lightType;
						if ($('#noLight').click())
							lightType = "No Natural Light";

						if ($('#noLight').click())
							lightType = "Window Light";

						if ($('#noLight').click())
							lightType = "SkyLight";
				
						var sqlTest3 = [roomID,
								$('#spaceid').val(), $('#spacelength').val(),
								$('#spacesqfoot').val(),
								$('#spacewidth').val(),
								$('#spaceheight').val(), interiorTF,
								$('#spaceactivity').val(),
								$('#select-choice-numswitches').val(),
								lightType ];// insert photo

						dby
								.transaction(function(transaction) {
									transaction
											.executeSql(
													'INSERT INTO ROOM(RoomID, SpaceID, SpaceLength, SpaceSquareFootage, SpaceWidth, SpaceHeight, InteriorTF, RoomMainPurpose, NumberofLightSwitches, NaturalLighting ) VALUES (?,?,?,?,?,?,?,?,?,?)',
													[ sqlTest3[0], sqlTest3[1],
															sqlTest3[2],
															sqlTest3[3],
															sqlTest3[4],
															sqlTest3[5],
															sqlTest3[6],
															sqlTest3[7],
															sqlTest3[8],
															sqlTest3[9]
															 ],
													nullHandler, errorHandler);
									console
											.log("Table 'ROOM' has inserted information.");
								roomCount++;
								});
						ListRoomsDBValues();
						return false;
					}
					;
					
					//needs adjusting unable to create pages within pages error occur
					function RoomPageCreation(row) {
						str = "<div id='"
								+ row.SpaceID
								+ "' data-role='page'  data-theme='b'><div data-role='header'>"
								+ "<h1>Shohosen</h1></div><!-- /header -->"
								+ "<div data-role='content'>"
								+ "<p>Welcome to the one stop care of FGI!</p>"
								+ "<ul data-role='listview' data-inset='true' data-native-menu='false' id='allRooms' data-filter='true'>"
								+ "<li>"
								+ row.SpaceLength
								+ "</li>"
								+
								"<li>"
								+ row.SpaceSquareFootage
								+ "</li>"
								+
								"<li>"
								+ row.SpaceWidth
								+ "</li>"
								+
								"<li>"
								+ row.SpaceHeight
								+ "</li>"
								+
								"<li>"
								+ row.InteriorTF
								+ "</li>"
								+

								"<li>"
								+ row.RoomMainPurpose
								+ "</li>"
								+

								"<li>"
								+ row.NumberofLightSwitches
								+ "</li>"
								+

								"<li>"
								+ row.NaturalLighting
								+ "</li>"
								+ "</ul></div><!-- /content -->"
								+ "<a href='#homePage' data-role='button' data-icon='star'>Back to the home page</a>"
								+ "</div><!-- /page -->";
						str += str;
						$("body").append(str);//when adding to a ul just apply to the id of said list

					}
					;
					function ListRoomsDBValues() {// The list of Romm form
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						// content is not just keep repeating lines
						$('#results').html('');
						dby
								.transaction(
										function(transaction) {
											transaction
													.executeSql(
															'SELECT * FROM ROOM',
															[],
															function(
																	transaction,
																	result) {
																console
																		.log(result.rows.length);
																if (result != null
																		&& result.rows != null) {
																	for ( var i = 0; i < result.rows.length; i++) {
																		var row = result.rows
																				.item(i);
																		//insert the room object within building object
																		  jsonTemp += JSON.stringify(row);
																			console.log(jsonTemp);
																			RoomPageCreation(row);
																			var s = "<li><a id='"
																				+ "link"+i
																				+ "' href='#"
																				+ row.SpaceID
																				+ "' >"
																				+ row.SpaceID
																				+ "</a></li>"
																		$(
																				'#order-List-Rooms')
																				.append(
																						s);
																			$(
																			'#order-List-Rooms')
																			.listview("refresh");
																		$(
																				'#results')
																				.append(
																						'<br>'
																								+ row.RoomID
																								+ ' '
																								+ row.SpaceID
																								+ ' '
																								+ row.SpaceLength
																								+ ' '
																								+ row.SpaceSquareFootage
																								+ ' '
																								+ row.SpaceWidth
																								+ ' '
																								+ row.SpaceHeight
																								+ ' '
																								+ row.InteriorTF
																								+ ' '
																								+ row.RoomMainPurpose
																								+ ' '
																								+ row.NumberofLightSwitches
																								+ ' '
																								+ row.NaturalLighting);
																	}
																}
															}, errorHandler);
										}, errorHandler, nullHandler);
						return;
					};
//					
					function nullHandler() {
					}
					;
// function successCallBack() {
// alert("DEBUGGING: success");
// }
// ;
					function errorHandler(transaction, error) {
						alert('Error: ' + error.message + ' code: '
								+ error.code);
					}
					;
					function showValues(form) {
						var str = $(form).serialize();
						$("#results").text(str);
					}
					;

					// client form validation
										
								

						

					$('#snapshot').click(
							function() {
								navigator.camera.getPicture(onCameraSuccess,
										onCameraError, {
											quality : 50
										});// add the server side location of
											// storage here
								console.log('debug: takePhoto called');
							});
					var onBodyLoad = function() {
						document.addEventListener("deviceready",
								App.Main.onDeviceReady, false);
					}
					var onCameraSuccess = function(imageURL) {
						navigator.notification.alert("onCameraSuccess: "
								+ imageURL);
						console.log('debug: onCameraSuccess called');
					}
					var onCameraError = function(e) {
						navigator.notification.alert("onCameraError: " + e);
						console.log('debug: onCameraError called');
					}

					// this function call insures safety check before begining
					// survey
				
			
// $("#spaceheight").focus(function(){
// var lng = $("#spacelength").val();
// var wid = $("#spacewidth").val();
// var sqFoot = lng * wid;
// $("#spacesqfoot").css("visable");
// $("#spacesqfoot").val(sqFoot);
// });
					
					
					
					
					function ListDBpage() {// Perscription form
						if (!window.openDatabase) {
							alert('Databases are not supported in this browser.');
							return;
						}
						;
						// content is not just keep repeating lines
						// $('#rXListPage').html('');
						db
								.transaction(
										function(transaction) {
											transaction
													.executeSql(
															'SELECT * FROM ROOM',
															[],
															function(
																	transaction,
																	result) {
																console
																		.log(result.rows.length);
																if (result != null
																		&& result.rows != null) {
																	for ( var i = 0; i < result.rows.length; i++) {
																		var row = result.rows
																				.item(i);
																		$('#order-List-Rooms').append("<li><a href='#"+row.RoomID+"'>"+row.RoomMainPurpose+"</a></li>");
																	}
																}
																
															}, errorHandler);
										}, errorHandler, nullHandler);
						return;
					}
					;

					$("#sendToServer").click(function(){
						//	console.log(jsonTemp);
							var client = "{client: {"+jsonTemp+"}";
							var blink;
							
							blink =                                                                      
							{"client": {
								"LegalBusinessName":"This is the legal business name ",
								"ContactName":"person to contact for information",
								"ContactTitle":"persons title in the business",
								"ContactEmail":"persons-email-contact-information@gmail.com",
								"ContactPhone":"persons phone number",
								"HoursOperationOpenMF":"11:11",
								"HoursOperationCloseMF":"11:11",
								"HoursOperationOpenSat":"11:11",
								"HoursOperationCloseSat":"11:11",
								"HoursOperationOpenSun":"11:11",
								"HoursOperationCloseSun":"11:11",
								"FacilityType":"What the business does/ its general description",
								"EPACT":"False","HVACFuelType":"Fueling for HVAC system",
								"UtilityCompany":"False",
								"MeterNumber":"electrical meter number",
								"AccountNumber":1111,
								"Building" : [{
									"BuildingBuiltYear":200013,
									"AgeOfLighting":1111,
									"EnergyBudget":1111,
									"EpactTaxDeductionTF":"False",
									"LightingControlSystemTF":"False",
									"NameOfDecisionMaker":"The name of the person that makes the decisions for the company",
									"EmailOfDecisionMaker":"Email-Of-The-person-above@gmail.com",
									"InstallationRequiredTF":"False",
									"UsingOutsideContractorTF":"False",
									"RoomCount" : 1111,
									"Room" : [{
										"SpaceID":"Identification for the room ",
										"SpaceLength":111,
										"SpaceSquareFootage":"",
										"SpaceWidth":1111,
										"SpaceHeight":1077,
										"InteriorTF":"False",
										"RoomMainPurpose":"Main Purpose of the room",
										"NumberofLightSwitches":2,
										"NaturalLighting":"SkyLight"
									}]

								}]
							}};
							blink = JSON.stringify(blink);//correctly formatted data styling
							client = JSON.stringify(client);//actual data may need format adjustment
							$(function() {      
						   $.ajax({
						            type: "POST",
						         //   url: "http://www.uwexchanger.com/snazz/create_new_client.php",
						            data: client,
						            success: function(data, textStatus, jqXHR){
						                console.log("DATA SENT!");
						                console.log("data: "+data+"\nTextStatus: "+ textStatus+"\njqXHR: "+jqXHR);
						                alert("Data successfully sent");
						            },
						            error: function(XMLHttpRequest, textStatus, errorThrown, jqXHR) {
						                console.log("request:"+XMLHttpRequest+",Error: "+ errorThrown);
						                alert("Data failed to sent");
						            }
						         });
						   
						        
						        
						})		;
								});	
				});
		