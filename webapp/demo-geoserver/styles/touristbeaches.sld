<?xml version='1.0' encoding='UTF-8'?>
<StyledLayerDescriptor xmlns="http://www.opengis.net/sld" xmlns:ogc="http://www.opengis.net/ogc" version="1.0.0"><NamedLayer>
        <Name>MSPudhu:Tourist_Beach_Puducherry</Name>
        <UserStyle>
            <Name>touristbeaches</Name>
            <IsDefault>1</IsDefault>
            <FeatureTypeStyle>
                <Name>name</Name>
                <Rule>
                    <Name />
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <Fill>
                                    <CssParameter name="fill">#fbf60b</CssParameter>
                                </Fill>
                                <Stroke>
                                    <CssParameter name="stroke-width">0.5</CssParameter>
                                </Stroke>
                            </Mark>
                            <Size>14</Size>
                        </Graphic>
                    </PointSymbolizer>
                    <PointSymbolizer>
                        <Graphic>
                            <Mark>
                                <WellKnownName>circle</WellKnownName>
                                <Fill>
                                    <CssParameter name="fill">#fbf60b</CssParameter>
                                </Fill>
                                <Stroke />
                            </Mark>
                            <Size>3</Size>
                        </Graphic>
                    </PointSymbolizer>
                </Rule>
                <Rule>
                    <TextSymbolizer>
                        <Label>
                            <ogc:PropertyName>Name</ogc:PropertyName>
                        </Label>
                        <Font>
                            <CssParameter name="font-family">Open Sans</CssParameter>
                            <CssParameter name="font-size">13</CssParameter>
                            <CssParameter name="font-style">normal</CssParameter>
                            <CssParameter name="font-weight">normal</CssParameter>
                        </Font>
                        <LabelPlacement>
                            <PointPlacement>
                                <AnchorPoint>
                                    <AnchorPointX>0</AnchorPointX>
                                    <AnchorPointY>0.5</AnchorPointY>
                                </AnchorPoint>
                            </PointPlacement>
                        </LabelPlacement>
                        <Fill>
                            <CssParameter name="fill">#ec3008</CssParameter>
                        </Fill>
                        <VendorOption name="maxDisplacement">1</VendorOption>
                    </TextSymbolizer>
                </Rule>
            </FeatureTypeStyle>
        </UserStyle>
    </NamedLayer>
    </StyledLayerDescriptor>